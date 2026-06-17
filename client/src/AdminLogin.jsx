import { useState } from 'react'

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Get password from environment variable or use a default secure password
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'storykid2024'

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate a slight delay for security feel
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        // Store session token in localStorage
        localStorage.setItem('admin_authenticated', 'true')
        localStorage.setItem('admin_session_time', Date.now().toString())
        onLogin()
      } else {
        setError('❌ Incorrect password. Try again.')
        setPassword('')
      }
      setIsLoading(false)
    }, 500)
  }

  return (
    <div style={styles.container}>
      <style>{styles.css}</style>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>✨</div>
          <h1 style={styles.title}>StoryKid Admin</h1>
          <p style={styles.subtitle}>Secure Dashboard Access</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              style={styles.input}
              disabled={isLoading}
              autoFocus
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            type="submit"
            disabled={isLoading || !password}
            style={{
              ...styles.button,
              opacity: isLoading || !password ? 0.6 : 1,
              cursor: isLoading || !password ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? '🔄 Verifying...' : '🔓 Access Dashboard'}
          </button>
        </form>

        <div style={styles.footer}>
          <p>🔒 Your admin dashboard is protected</p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f0a1e 0%, #1a0f3a 50%, #0a1628 100%)',
    fontFamily: "'Nunito', sans-serif",
    padding: '20px',
  },
  card: {
    background: 'linear-gradient(135deg, #1a0f3a, #0f1a2e)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '24px',
    padding: '48px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
    animation: 'fadeIn 0.4s ease',
  },
  header: {
    textAlign: 'center',
    marginBottom: '36px',
  },
  logo: {
    fontSize: '56px',
    marginBottom: '16px',
    display: 'block',
  },
  title: {
    fontFamily: "'Baloo 2', cursive",
    fontSize: '28px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #a855f7, #6366f1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 8px',
    color: 'white',
  },
  subtitle: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.4)',
    margin: '0',
  },
  formGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '700',
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px',
    padding: '14px 16px',
    color: 'white',
    fontFamily: "'Nunito', sans-serif",
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '14px',
    borderRadius: '14px',
    border: 'none',
    background: 'linear-gradient(135deg, #a855f7, #6366f1)',
    color: 'white',
    fontFamily: "'Nunito', sans-serif",
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 20px rgba(168,85,247,0.4)',
    marginBottom: '24px',
  },
  error: {
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'rgba(220,50,50,0.15)',
    border: '1px solid rgba(220,50,50,0.3)',
    color: '#ff8080',
    fontSize: '13px',
    marginBottom: '16px',
    textAlign: 'center',
  },
  footer: {
    textAlign: 'center',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.3)',
  },
  css: `
    @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;800&family=Nunito:wght@400;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    input:focus {
      border-color: rgba(168,85,247,0.6) !important;
      background: rgba(168,85,247,0.08) !important;
      box-shadow: 0 0 0 3px rgba(168,85,247,0.15) !important;
    }
    button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(168,85,247,0.5) !important;
    }
  `
}
