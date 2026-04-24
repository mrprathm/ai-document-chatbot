# 🤖 AI Document Chatbot

[![Python](https://img.shields.io/badge/Python-3.11-blue?style=flat-square&logo=python)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-black?style=flat-square&logo=flask)](https://flask.palletsprojects.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Free-4285F4?style=flat-square&logo=google)](https://aistudio.google.com)

> Upload any PDF or TXT document and chat with it using Google Gemini AI.

---

## 👨‍💻 Developer

**Pratham Rathod**
- 🎓 B.E. Information Technology — D.Y. Patil College of Engineering, Pune (CGPA: 8.10)
- 📧 prathamrathod200@gmail.com
- 🐙 [github.com/mrprathm](https://github.com/mrprathm)
- 💼 [linkedin.com/in/prathamrathod](https://linkedin.com/in/prathamrathod)

---

## ✨ Features

- 📄 Upload PDF or TXT documents (up to 10MB)
- 💬 Chat with your document using Gemini AI
- 🔍 Smart keyword-based chunk retrieval
- 🎨 Modern dark-themed React UI
- ⚡ Fast responses with Flask backend

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Python Flask |
| AI Model | Google Gemini 1.5 Flash (Free) |
| PDF Processing | PyPDF2 |
| Libraries | python-dotenv, flask-cors |

---

## 🚀 Setup & Run

### 1. Clone
```bash
git clone https://github.com/mrprathm/ai-document-chatbot.git
cd ai-document-chatbot
```

### 2. Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your GEMINI_API_KEY in .env
python app.py
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Open
```
http://localhost:5173
```

---

## 🔑 .env File
```
GEMINI_API_KEY=your_key_here
FLASK_PORT=5000
MAX_FILE_SIZE_MB=10
```

Get free API key → [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

---

## 📁 Project Structure

```
ai-document-chatbot/
├── backend/
│   ├── app.py                 ← Flask API
│   ├── document_processor.py  ← PDF processing
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadZone.jsx
│   │   │   └── ChatWindow.jsx
│   │   └── App.jsx
│   └── vite.config.js
└── README.md
```

---

## 📖 How It Works

```
Upload PDF/TXT
     ↓
PyPDF2 extracts text
     ↓
Text split into chunks
     ↓
User asks a question
     ↓
Relevant chunks retrieved
     ↓
Gemini AI answers ✅
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| POST | `/api/upload` | Upload & process document |
| POST | `/api/chat` | Ask question about document |
| POST | `/api/clear` | Clear document session |

---

⭐ **Star this repo if you found it helpful!**

*Made with ❤️ by Pratham Rathod — AIML Project 2025*
