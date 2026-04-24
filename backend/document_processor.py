"""
document_processor.py
Author: Pratham Rathod
GitHub: github.com/prathamrathod
"""

import os
import PyPDF2
from typing import List, Dict


class DocumentProcessor:
    def __init__(self):
        self.documents: Dict[str, List[str]] = {}
        self.chunk_size = 1000
        self.chunk_overlap = 200

    def extract_text_from_pdf(self, file_path: str) -> str:
        text = ""
        with open(file_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                text += page.extract_text() + "\n"
        return text

    def extract_text_from_txt(self, file_path: str) -> str:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()

    def chunk_text(self, text: str) -> List[str]:
        chunks = []
        start = 0
        text_length = len(text)
        while start < text_length:
            end = start + self.chunk_size
            chunk = text[start:end]
            if end < text_length:
                last_period = chunk.rfind('. ')
                if last_period > self.chunk_size // 2:
                    chunk = chunk[:last_period + 1]
                    end = start + last_period + 1
            chunks.append(chunk.strip())
            start = end - self.chunk_overlap
        return [c for c in chunks if c]

    def process_file(self, file_path: str, session_id: str) -> Dict:
        ext = os.path.splitext(file_path)[1].lower()
        if ext == ".pdf":
            text = self.extract_text_from_pdf(file_path)
        elif ext == ".txt":
            text = self.extract_text_from_txt(file_path)
        else:
            raise ValueError(f"Unsupported file type: {ext}")
        if not text.strip():
            raise ValueError("Could not extract text from document")
        chunks = self.chunk_text(text)
        self.documents[session_id] = chunks
        return {
            "session_id": session_id,
            "chunks": len(chunks),
            "total_chars": len(text),
            "preview": text[:300] + "..." if len(text) > 300 else text
        }

    def search_relevant_chunks(self, session_id: str, query: str, top_k: int = 4) -> str:
        if session_id not in self.documents:
            raise ValueError("Document not found. Please upload first.")
        chunks = self.documents[session_id]
        query_words = set(query.lower().split())
        scored_chunks = []
        for chunk in chunks:
            chunk_words = set(chunk.lower().split())
            score = len(query_words.intersection(chunk_words))
            scored_chunks.append((score, chunk))
        scored_chunks.sort(key=lambda x: x[0], reverse=True)
        top_chunks = [chunk for _, chunk in scored_chunks[:top_k]]
        if all(score == 0 for score, _ in scored_chunks[:top_k]):
            top_chunks = chunks[:top_k]
        return "\n\n---\n\n".join(top_chunks)

    def clear_session(self, session_id: str):
        if session_id in self.documents:
            del self.documents[session_id]