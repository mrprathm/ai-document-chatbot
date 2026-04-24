"""
app.py - AI Document Chatbot Backend
Author   : Pratham Rathod
Email    : prathamrathod200@gmail.com
GitHub   : github.com/prathamrathod
College  : D.Y. Patil College of Engineering, Pune
"""

import os
import uuid
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from document_processor import DocumentProcessor

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:3000"])

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"pdf", "txt"}
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE_MB", 10)) * 1024 * 1024

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

processor = DocumentProcessor()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "Server running - Pratham Rathod"})


@app.route("/api/upload", methods=["POST"])
def upload_document():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400
    if not allowed_file(file.filename):
        return jsonify({"error": "Only PDF and TXT files allowed"}), 400
    file.seek(0, 2)
    file_size = file.tell()
    file.seek(0)
    if file_size > MAX_FILE_SIZE:
        return jsonify({"error": "File too large"}), 400
    session_id = str(uuid.uuid4())
    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, f"{session_id}_{filename}")
    try:
        file.save(file_path)
        result = processor.process_file(file_path, session_id)
        return jsonify({
            "success": True,
            "session_id": session_id,
            "filename": filename,
            "chunks": result["chunks"],
            "preview": result["preview"],
            "message": f"Document processed! ({result['chunks']} chunks)"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    session_id = data.get("session_id")
    question = data.get("question", "").strip()
    chat_history = data.get("history", [])

    if not session_id:
        return jsonify({"error": "session_id required"}), 400
    if not question:
        return jsonify({"error": "Question cannot be empty"}), 400

    try:
        context = processor.search_relevant_chunks(session_id, question)

        system_prompt = f"""You are an intelligent document assistant built by Pratham Rathod.
Answer questions based ONLY on the document context below.
If the answer is not in the document, say "I couldn't find that in the document."
Be concise, clear, and helpful.

DOCUMENT CONTEXT:
{context}
"""
        # Build Gemini chat history
        history = []
        for msg in chat_history[-6:]:
            role = "user" if msg["role"] == "user" else "model"
            history.append({"role": role, "parts": [msg["content"]]})

        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=system_prompt
        )
        chat_session = model.start_chat(history=history)
        response = chat_session.send_message(question)

        return jsonify({
            "success": True,
            "answer": response.text,
            "session_id": session_id
        })

    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/clear", methods=["POST"])
def clear_session():
    data = request.get_json()
    session_id = data.get("session_id")
    if session_id:
        processor.clear_session(session_id)
    return jsonify({"success": True})


if __name__ == "__main__":
    port = int(os.getenv("FLASK_PORT", 5000))
    print(f"Server running → http://localhost:{port}")
    print("Author: Pratham Rathod | github.com/prathamrathod")
    app.run(debug=True, port=port)