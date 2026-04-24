import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'

export default function UploadZone({ onDocumentReady }) {
  const [status, setStatus] = useState(null)
  const [message, setMessage] = useState('')
  const [preview, setPreview] = useState('')

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return
    setStatus('uploading')
    setMessage('Processing your document...')
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setStatus('success')
      setMessage(`✅ "${file.name}" — ${res.data.chunks} chunks extracted`)
      setPreview(res.data.preview)
      onDocumentReady(res.data.session_id, file.name)
    } catch (err) {
      setStatus('error')
      setMessage('❌ ' + (err.response?.data?.error || 'Upload failed'))
    }
  }, [onDocumentReady])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] },
    maxFiles: 1,
  })

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'24px', padding:'60px 20px' }}>
      <h1 style={{ fontSize:'36px', fontWeight:800, background:'linear-gradient(135deg,#7c6ef7,#e879b8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', textAlign:'center' }}>
        AI Document Chatbot
      </h1>
      <p style={{ color:'#8888aa', fontSize:'15px', textAlign:'center' }}>
        by <strong style={{color:'#7c6ef7'}}>Pratham Rathod</strong> &nbsp;|&nbsp; Upload PDF/TXT and chat with AI
      </p>

      <div {...getRootProps()} style={{
        border: `2px dashed ${isDragActive ? '#7c6ef7' : '#2a2a3d'}`,
        borderRadius:'16px', padding:'60px 40px', textAlign:'center',
        cursor:'pointer', width:'100%', maxWidth:'500px',
        background: isDragActive ? 'rgba(124,110,247,0.08)' : 'rgba(26,26,38,0.6)',
        transition:'all 0.3s ease'
      }}>
        <input {...getInputProps()} />
        <div style={{ fontSize:'52px', marginBottom:'16px' }}>{isDragActive ? '📂' : '📄'}</div>
        <p style={{ color:'#e8e8f0', fontSize:'16px', fontWeight:600 }}>
          {isDragActive ? 'Drop it here!' : 'Drag & drop your document'}
        </p>
        <p style={{ color:'#8888aa', fontSize:'13px', marginTop:'8px' }}>PDF or TXT • Max 10MB</p>
        <button
          onClick={e => e.stopPropagation()}
          style={{ marginTop:'16px', padding:'10px 24px', background:'linear-gradient(135deg,#7c6ef7,#e879b8)', border:'none', borderRadius:'8px', color:'white', fontWeight:700, fontSize:'14px', cursor:'pointer' }}>
          Browse Files
        </button>
      </div>

      {status && (
        <div style={{
          width:'100%', maxWidth:'500px', padding:'16px', borderRadius:'12px', fontSize:'14px', fontWeight:600,
          background: status==='success'?'rgba(74,222,128,0.1)':status==='error'?'rgba(248,113,113,0.1)':'rgba(124,110,247,0.1)',
          border:`1px solid ${status==='success'?'#4ade80':status==='error'?'#f87171':'#7c6ef7'}`,
          color: status==='success'?'#4ade80':status==='error'?'#f87171':'#7c6ef7'
        }}>
          {message}
        </div>
      )}

      {preview && (
        <div style={{ width:'100%', maxWidth:'500px' }}>
          <p style={{ color:'#8888aa', fontSize:'12px', marginBottom:'8px' }}>📋 DOCUMENT PREVIEW:</p>
          <div style={{ padding:'16px', background:'rgba(26,26,38,0.8)', border:'1px solid #2a2a3d', borderRadius:'12px', fontSize:'13px', color:'#8888aa', lineHeight:1.7 }}>
            {preview}
          </div>
        </div>
      )}
    </div>
  )
}