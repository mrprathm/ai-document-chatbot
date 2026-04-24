import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

const SUGGESTIONS = [
  "Summarize this document",
  "What are the key points?",
  "What topics does it cover?",
  "Give me the main conclusions"
]

export default function ChatWindow({ sessionId, filename, onNewDocument }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEnd = useRef(null)

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const question = (text || input).trim()
    if (!question || loading) return
    setMessages(prev => [...prev, { role: 'user', content: question }])
    setInput('')
    setLoading(true)
    try {
      const res = await axios.post('/api/chat', {
        session_id: sessionId, question, history: messages
      })
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.answer }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ ' + (err.response?.data?.error || 'Something went wrong') }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', maxWidth:'860px', margin:'0 auto' }}>
      <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}`}</style>

      {/* Header */}
      <div style={{ padding:'16px 24px', borderBottom:'1px solid #2a2a3d', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(18,18,26,0.95)', position:'sticky', top:0, zIndex:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{ width:'38px', height:'38px', borderRadius:'10px', background:'linear-gradient(135deg,#7c6ef7,#e879b8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px' }}>📄</div>
          <div>
            <div style={{ fontWeight:700, fontSize:'14px', color:'#e8e8f0' }}>{filename}</div>
            <div style={{ fontSize:'12px', color:'#8888aa' }}>Built by Pratham Rathod • AI Ready</div>
          </div>
        </div>
        <button onClick={onNewDocument} style={{ padding:'8px 16px', background:'transparent', border:'1px solid #2a2a3d', borderRadius:'8px', color:'#8888aa', cursor:'pointer', fontSize:'13px', fontWeight:600 }}>
          + New Document
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'24px', display:'flex', flexDirection:'column', gap:'16px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 20px', color:'#8888aa' }}>
            <div style={{ fontSize:'52px', marginBottom:'16px' }}>🤖</div>
            <div style={{ fontSize:'22px', fontWeight:700, color:'#e8e8f0', marginBottom:'8px' }}>Ready to answer!</div>
            <p>Ask anything about <strong style={{ color:'#7c6ef7' }}>{filename}</strong></p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', justifyContent:'center', marginTop:'24px' }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendMessage(s)} style={{ padding:'8px 18px', background:'rgba(124,110,247,0.1)', border:'1px solid rgba(124,110,247,0.3)', borderRadius:'20px', color:'#7c6ef7', cursor:'pointer', fontSize:'13px', fontWeight:600 }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            maxWidth:'80%',
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            padding:'14px 18px',
            borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            background: msg.role === 'user' ? 'linear-gradient(135deg,#7c6ef7,#e879b8)' : 'rgba(26,26,38,0.9)',
            border: msg.role === 'user' ? 'none' : '1px solid #2a2a3d',
            fontSize:'14px', lineHeight:1.65, color:'#e8e8f0'
          }}>
            {msg.role === 'assistant' ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
          </div>
        ))}

        {loading && (
          <div style={{ alignSelf:'flex-start', padding:'14px 18px', borderRadius:'18px 18px 18px 4px', background:'rgba(26,26,38,0.9)', border:'1px solid #2a2a3d', display:'flex', gap:'5px', alignItems:'center' }}>
            {[0, 0.2, 0.4].map((d, i) => (
              <div key={i} style={{ width:'7px', height:'7px', background:'#7c6ef7', borderRadius:'50%', animation:`bounce 1.2s ${d}s infinite` }} />
            ))}
          </div>
        )}
        <div ref={messagesEnd} />
      </div>

      {/* Input */}
      <div style={{ padding:'16px 24px', borderTop:'1px solid #2a2a3d', background:'rgba(18,18,26,0.95)' }}>
        <div style={{ display:'flex', gap:'12px', alignItems:'flex-end' }}>
          <textarea
            style={{ flex:1, padding:'12px 16px', background:'rgba(26,26,38,0.8)', border:'1px solid #2a2a3d', borderRadius:'12px', color:'#e8e8f0', fontFamily:'inherit', fontSize:'14px', resize:'none', outline:'none', minHeight:'48px', lineHeight:1.5 }}
            placeholder="Ask a question about your document..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{ width:'48px', height:'48px', borderRadius:'12px', background:'linear-gradient(135deg,#7c6ef7,#e879b8)', border:'none', cursor:'pointer', fontSize:'20px', flexShrink:0, opacity:(!input.trim()||loading)?0.5:1 }}>
            ➤
          </button>
        </div>
        <p style={{ color:'#8888aa', fontSize:'11px', marginTop:'8px', textAlign:'center' }}>
          Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}