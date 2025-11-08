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
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Email Reply Generator</h1>
      <p>Generate email replies instantly</p>

      <textarea
        value={emailContent}
        onChange={(e) => setEmailContent(e.target.value)}
        placeholder="Paste email here..."
        style={{ width: '100%', height: '120px', marginBottom: '1rem' }}
      />

      <div style={{ marginBottom: '1rem' }}>
        {['professional', 'friendly', 'casual', 'formal'].map(t => (
          <button
            key={t}
            onClick={() => setTone(t)}
            style={{
              marginRight: '0.5rem',
              padding: '0.5rem 1rem',
              background: tone === t ? '#4f46e5' : '#eee',
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
          padding: '0.75rem 1.5rem',
          background: '#4f46e5',
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
