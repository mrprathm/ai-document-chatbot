import React, { useState } from 'react'
import UploadZone from './components/UploadZone'
import ChatWindow from './components/ChatWindow'
import axios from 'axios'

export default function App() {
  const [sessionId, setSessionId] = useState(null)
  const [filename, setFilename] = useState('')

  const handleDocumentReady = (sid, fname) => {
    setSessionId(sid)
    setFilename(fname)
  }

  const handleNewDocument = async () => {
    if (sessionId) {
      try { await axios.post('/api/clear', { session_id: sessionId }) } catch (_) {}
    }
    setSessionId(null)
    setFilename('')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 20% 20%, rgba(124,110,247,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(232,121,184,0.08) 0%, transparent 50%), #0a0a0f'
    }}>
      {!sessionId ? (
        <UploadZone onDocumentReady={handleDocumentReady} />
      ) : (
        <ChatWindow sessionId={sessionId} filename={filename} onNewDocument={handleNewDocument} />
      )}
    </div>
  )
}