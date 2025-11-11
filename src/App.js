import React, { useState } from 'react';

export default function EmailReplyGenerator() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('professional');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);


  const generateReply = async () => {
    if (!emailContent.trim()) {
      setError('Please enter an email to reply to');
      return;
    }

    setLoading(true);
    setError('');
    setReply('');

    try {
      const response = await fetch('http://localhost:3001/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailContent, tone })
      });

      if (!response.ok) throw new Error('Failed to generate reply');

      const data = await response.json();
      setReply(data.reply);
    } catch {
      setError('Failed to generate reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <img src="https://th.bing.com/th/id/R.67ddf4334044a56bb4b10aa92942a171?rik=ZCvr3w4fTeWADg&riu=http%3a%2f%2fwww.bluebuddhaboutique.com%2fblog%2fwp-content%2fuploads%2f2015%2f03%2fEmail_icon.jpg&ehk=JLyAfA6ghXJxHUx8jt2A4Ke%2fIJAZig42TOZxreP6v58%3d&risl=&pid=ImgRaw&r=0" style={{padding: '0.1rem', height:'60px',width:"auto"}} alt="hi"/>

      <h1 style={{padding :"1rem",justifyContent:'center', backgroundColor : "#0BEBE6" , color:"#193D8D" , borderRadius:'4px',fontSize:"30px"}}>Email Reply Generator</h1>
      <p style={{fontSize:"15px"}}> Generate email replies instantly</p>

      <textarea
  value={emailContent}
  onChange={(e) => setEmailContent(e.target.value)}
  placeholder="Paste your email content here..."
  style={{
    width: '100%',
    height: '200px',
    padding: '12px 14px',
    border: '2px dashed #193D8D',
    borderRadius: '8px',
    fontSize: '15px',
    lineHeight: '1.5',
    fontFamily: 'Arial, sans-serif',
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '1rem',
    transition: 'border-color 0.2s ease',
  }}
  onFocus={(e) => (e.target.style.borderColor = '#007BFF')}
  onBlur={(e) => (e.target.style.borderColor = '#ccc')}
/>

      <div style={{ marginBottom: '1rem' }}>
        {['professional', 'friendly', 'casual', 'formal'].map(t => (
          <button
            key={t}
            onClick={() => setTone(t)}
            style={{
              marginRight: '0.5rem',
              marginBottom: '0.5rem',
              padding: '1rem 1.5rem',
              background: tone === t ? '#193D8D' : '#0BEBE6',
              color: tone === t ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <button
        onClick={generateReply}
        disabled={loading}
        style={{
          padding: '0.9rem 2rem',
          background: '#193D8D',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Generating...' : 'Generate Reply'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {reply && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Generated Reply</h3>
          <button onClick={copyToClipboard}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: '1rem' }}>
            {reply}
          </pre>
        </div>
      )}
    </div>
    
  );
}
