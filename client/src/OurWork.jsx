import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { API_BASE } from './api';

// ── THE CRITICAL VITE FIX: USE CODELOCK CDN FOR THE WORKER ──
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// ── CSS STYLES ──
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;800&family=Nunito:wght@400;600;700;800&display=swap');
  
  :root {
    --bg-main: #FDFBF7;
    --primary-light: #F4A261;
    --primary-main: #E76F51;
    --primary-dark: #D45D40;
    --accent: #2A9D8F;
    --text-main: #2C363F;
    --text-muted: #6B7280;
    --card-bg: #FFFFFF;
    --border-color: #E5E7EB;
    --input-bg: #F9FAFB;
    --highlight-bg: #FFF9F2;
    --btn-shadow: rgba(44, 54, 63, 0.15);
    --nav-bg: rgba(253, 251, 247, 0.85);
  }

  .dark-mode {
    --bg-main: #1F1B18; 
    --primary-light: #F4A261;
    --primary-main: #E76F51;
    --primary-dark: #D45D40;
    --accent: #2A9D8F;
    --text-main: #FDFBF7;
    --text-muted: #A3A3A3;
    --card-bg: #2A2420;
    --border-color: #3F362F;
    --input-bg: #362E28;
    --highlight-bg: #2E2620;
    --btn-shadow: rgba(0, 0, 0, 0.4);
    --nav-bg: rgba(31, 27, 24, 0.85);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ow-root {
    min-height: 100vh;
    background-color: var(--bg-main);
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
    font-family: 'Nunito', sans-serif;
    color: var(--text-main);
    overflow-x: hidden;
    position: relative;
    transition: background-color 0.4s, color 0.4s;
  }

  /* ── WARM WATERCOLOR BACKGROUNDS ── */
  .ow-bg-blob {
    position: fixed; border-radius: 50%; filter: blur(80px); opacity: 0.15;
    animation: floatBlob var(--dur) ease-in-out infinite alternate;
    z-index: 0; pointer-events: none;
  }
  .ow-blob-1 { width: 50vw; height: 50vw; background: var(--primary-light); top: -10vh; left: -10vw; --dur: 15s; }
  .ow-blob-2 { width: 40vw; height: 40vw; background: var(--accent); bottom: -10vh; right: -5vw; --dur: 18s; animation-delay: -5s; }

  @keyframes floatBlob { 
    0% { transform: translate(0, 0) scale(1); } 
    100% { transform: translate(5vw, 5vh) scale(1.05); } 
  }

  /* ── NAV ── */
  .ow-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 48px;
    background: var(--nav-bg);
    backdrop-filter: blur(12px);
    border-bottom: 2px dashed var(--border-color);
    transition: background-color 0.4s, border-color 0.4s;
  }
  .ow-nav-logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 18px;
    border: 2px solid rgba(255,255,255,0.72);
    background: rgba(255,255,255,0.18);
    box-shadow: 0 20px 35px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: transform 0.25s, border-color 0.25s, background 0.25s;
  }
  .ow-nav-logo:hover {
    transform: translateY(-1px);
    border-color: var(--primary-main);
    background: rgba(255,255,255,0.25);
  }
  .ow-logo-img {
    width: 42px;
    height: 42px;
    object-fit: cover;
    border-radius: 16px;
  }
  .ow-nav-controls {
    display: flex; gap: 12px; align-items: center;
  }
  .ow-theme-btn {
    width: 44px; height: 44px; border-radius: 12px;
    background: var(--card-bg); border: 2px solid var(--border-color);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; cursor: pointer; transition: all 0.2s;
    box-shadow: 3px 3px 0px rgba(0,0,0,0.05); color: var(--text-main);
  }
  .ow-theme-btn:hover {
    background: var(--input-bg); border-color: var(--primary-light);
    transform: translate(-2px, -2px); box-shadow: 5px 5px 0px rgba(0,0,0,0.08);
  }

  /* BUTTONS */
  .ow-btn-outline {
    padding: 10px 24px; border-radius: 12px; 
    border: 2px solid var(--border-color); background: var(--card-bg);
    color: var(--text-muted); font-family: 'Nunito', sans-serif;
    font-size: 14px; font-weight: 800; cursor: pointer; transition: all 0.2s;
  }
  .ow-btn-outline:hover {
    background: var(--input-bg); color: var(--text-main); 
    transform: translate(-2px, -2px); box-shadow: 4px 4px 0px rgba(0,0,0,0.05);
  }
  
  .ow-btn-primary { 
    padding: 10px 24px; border-radius: 12px; border: 2px solid var(--text-main); 
    background: var(--primary-main); color: white; 
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800; 
    cursor: pointer; transition: all 0.2s; 
    box-shadow: 4px 4px 0px var(--btn-shadow);
  }
  .ow-btn-primary:hover { 
    transform: translate(-2px, -2px); box-shadow: 6px 6px 0px var(--btn-shadow); background: var(--primary-dark); 
  }
  .ow-btn-primary:active { transform: translate(2px, 2px); box-shadow: 0px 0px 0px transparent; }

  /* ── HERO ── */
  .ow-hero {
    padding: 160px 24px 80px;
    text-align: center;
    position: relative; z-index: 1;
  }
  .ow-hero-tag {
    display: inline-block; padding: 6px 16px; border-radius: 8px;
    background: rgba(42, 157, 143, 0.1); border: 2px solid rgba(42, 157, 143, 0.2);
    color: var(--accent); font-size: 14px; font-weight: 800; letter-spacing: 1px;
    text-transform: uppercase; margin-bottom: 24px;
  }
  .ow-hero-title {
    font-family: 'Baloo 2', cursive; font-size: clamp(36px, 6vw, 64px);
    font-weight: 800; margin-bottom: 16px; line-height: 1.1; color: var(--text-main);
  }
  .ow-hero-sub { color: var(--text-muted); font-size: 20px; max-width: 500px; margin: 0 auto; font-weight: 600;}

  /* ── GRID ── */
  .ow-grid-wrap { padding: 40px 48px 100px; max-width: 1300px; margin: 0 auto; position: relative; z-index: 1; }
  .ow-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }

  /* ── STORY CARD ── */
  .ow-card {
    border-radius: 16px; overflow: hidden; cursor: pointer;
    background: var(--card-bg);
    border: 2px solid var(--border-color);
    transition: all 0.3s;
    position: relative;
    box-shadow: 6px 6px 0px rgba(0,0,0,0.04);
  }
  .ow-card:hover {
    transform: translateY(-6px);
    border-color: var(--primary-light);
    box-shadow: 8px 8px 0px rgba(231, 111, 81, 0.15);
  }
  .ow-card-cover {
    width: 100%; aspect-ratio: 12/8.5;
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
    border-bottom: 2px dashed var(--border-color);
  }
  .ow-card-cover-bg {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 80px; opacity: 0.1;
  }
  .ow-card-image {
    width: 100%; height: 100%; object-fit: cover;
  }
  .ow-card-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, var(--card-bg) 0%, transparent 80%);
    display: flex; align-items: flex-end; padding: 20px;
    opacity: 0; transition: opacity 0.3s;
  }
  .ow-card:hover .ow-card-overlay { opacity: 1; }
  .ow-card-open-btn {
    width: 100%; padding: 12px; border-radius: 12px; border: 2px solid var(--text-main);
    background: var(--primary-main); color: white; 
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800; cursor: pointer;
    box-shadow: 4px 4px 0px rgba(0,0,0,0.15);
  }
  
  .ow-card-info { padding: 24px; }
  .ow-card-title { font-family: 'Baloo 2', cursive; font-size: 20px; font-weight: 800; margin-bottom: 12px; color: var(--text-main); line-height: 1.2; }
  .ow-card-meta { display: flex; gap: 8px; flex-wrap: wrap; }
  .ow-card-tag {
    padding: 4px 12px; border-radius: 8px; font-size: 12px; font-weight: 700;
    background: var(--highlight-bg); color: var(--primary-main);
    border: 1px solid var(--border-color);
  }

  /* ── BOOK MODAL ── */
  .ow-modal-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    animation: fadeIn 0.3s ease;
    padding: 20px;
  }
  @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }

  .ow-book-header {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; max-width: 1100px; margin-bottom: 24px;
    background: var(--card-bg); padding: 16px 24px; border-radius: 16px;
    border: 2px solid var(--border-color); box-shadow: 6px 6px 0px rgba(0,0,0,0.2);
  }
  .ow-book-title { font-family: 'Baloo 2', cursive; font-size: 24px; font-weight: 800; color: var(--text-main); }
  .ow-book-close {
    width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--border-color);
    background: var(--input-bg); color: var(--text-main);
    font-size: 18px; font-weight: bold; cursor: pointer; 
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .ow-book-close:hover { background: #FEE2E2; border-color: #EF4444; color: #EF4444; transform: scale(1.05); }

  /* ── 3D BOOK VIEWER ── */
  .ow-book-scene {
    perspective: 2000px;
    width: 100%; max-width: 1100px;
    position: relative;
    min-height: 300px;
    display: flex; justify-content: center; align-items: center;
    padding: 20px;
  }
  .ow-book-spread {
    display: flex; align-items: center; justify-content: center;
    position: relative;
  }

  .ow-page-left, .ow-page-right {
    width: 50%; 
    background: var(--input-bg); overflow: hidden; position: relative;
    transition: transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
    display: flex; justify-content: center; align-items: center;
    will-change: transform;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transform: translateZ(0);
    border: 1px solid var(--border-color);
  }
  .ow-page-left {
    border-radius: 8px 0 0 8px; transform-origin: right center;
    box-shadow: -8px 0 20px rgba(0,0,0,0.15);
  }
  .ow-page-right {
    border-radius: 0 8px 8px 0; transform-origin: left center;
    box-shadow: 8px 0 20px rgba(0,0,0,0.15);
  }

  .ow-page-left.ow-flip-left { transform: rotateY(-25deg) translateZ(0); }
  .ow-page-left.ow-flip-right { transform: rotateY(25deg) translateZ(0); }
  .ow-page-right.ow-flip-right { transform: rotateY(-25deg) translateZ(0); }
  .ow-page-right.ow-flip-left { transform: rotateY(25deg) translateZ(0); }

  .ow-book-spine {
    position: absolute; left: 50%; top: 0; bottom: 0;
    width: 12px; transform: translateX(-50%);
    background: linear-gradient(90deg, rgba(0,0,0,0.1), rgba(0,0,0,0.02), rgba(0,0,0,0.1));
    z-index: 10; pointer-events: none;
    box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
  }

  /* Page curl effect */
  .ow-page-left::after, .ow-page-right::after {
    content: ''; position: absolute; bottom: 0; width: 60px; height: 60px; pointer-events: none; transition: all 0.3s;
  }
  .ow-page-left::after { right: 0; background: radial-gradient(circle at bottom right, rgba(0,0,0,0.05) 0%, transparent 70%); }
  .ow-page-right::after { left: 0; background: radial-gradient(circle at bottom left, rgba(0,0,0,0.05) 0%, transparent 70%); }

  .react-pdf__Page__canvas { max-width: 100% !important; height: auto !important; }
  .react-pdf__Page__textContent, .react-pdf__Page__annotations { display: none !important; }

  /* ── MODAL CONTROLS ── */
  .ow-book-controls { display: flex; align-items: center; gap: 24px; margin-top: 24px; background: var(--card-bg); padding: 16px 24px; border-radius: 16px; border: 2px solid var(--border-color); box-shadow: 6px 6px 0px rgba(0,0,0,0.2); }
  .ow-ctrl-btn {
    width: 48px; height: 48px; border-radius: 50%; border: 2px solid var(--text-main);
    background: var(--input-bg); color: var(--text-main); font-size: 20px; font-weight: bold; cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 3px 3px 0px rgba(0,0,0,0.1);
  }
  .ow-ctrl-btn:hover:not(:disabled) {
    background: var(--primary-main); border-color: var(--primary-main); color: white;
    transform: translate(-2px, -2px); box-shadow: 5px 5px 0px rgba(0,0,0,0.15);
  }
  .ow-ctrl-btn:disabled { opacity: 0.3; cursor: not-allowed; border-color: var(--border-color); box-shadow: none; color: var(--text-muted); }
  
  .ow-page-indicator { font-size: 16px; color: var(--text-muted); font-weight: 800; min-width: 80px; text-align: center; }
  
  .ow-order-btn {
    padding: 14px 32px; border-radius: 12px; border: 2px solid var(--text-main);
    background: var(--primary-main); color: white; font-family: 'Nunito', sans-serif;
    font-size: 16px; font-weight: 800; cursor: pointer; transition: all 0.2s; box-shadow: 4px 4px 0px rgba(0,0,0,0.15);
  }
  .ow-order-btn:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px rgba(0,0,0,0.2); background: var(--primary-dark); }

  @media (max-width: 900px) {
    .ow-grid { grid-template-columns: repeat(2, 1fr); }
    .ow-grid-wrap { padding: 40px 20px 80px; }
    .ow-nav { padding: 14px 20px; }
    .ow-book-scene { padding: 10px; }
  }
  @media (max-width: 600px) {
    .ow-grid { grid-template-columns: 1fr; }
    .ow-book-spread { flex-direction: column; }
    .ow-page-left, .ow-page-right { width: 100%; max-width: 100%; border-radius: 8px; }
    .ow-book-spine { display: none; }
    .ow-book-scene { padding: 0; }
  }
`;

function BackgroundBlobs() {
  return (
    <>
      <div className="ow-bg-blob ow-blob-1" />
      <div className="ow-bg-blob ow-blob-2" />
    </>
  )
}

// ── COMPONENT: BOOK VIEWER ──
function BookViewer({ story, onClose, onOrder }) {
  const [currentSpread, setCurrentSpread] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(false);
  const [pageWidth, setPageWidth] = useState(540);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    calculatePageWidth();
  };

  const calculatePageWidth = () => {
    const maxWidth = 1100;
    const padding = 40;
    const availableWidth = typeof window !== 'undefined' ? Math.min(window.innerWidth - padding * 2, maxWidth) : maxWidth;
    const pageWidth = Math.max((availableWidth - 12) / 2, 200); // -12 for spine
    setPageWidth(pageWidth);
  };

  useEffect(() => {
    calculatePageWidth();
    window.addEventListener('resize', calculatePageWidth);
    return () => window.removeEventListener('resize', calculatePageWidth);
  }, []);

  const onDocumentLoadError = (err) => {
    console.error("Failed to load PDF:", err);
    setError(true);
  };

  const totalSpreads = numPages ? Math.ceil(numPages / 2) : 1;

  const flip = (dir) => {
    if (flipping || !numPages) return;
    if (dir === 'next' && currentSpread >= totalSpreads - 1) return;
    if (dir === 'prev' && currentSpread <= 0) return;

    setFlipping(true);
    setFlipDir(dir);

    setTimeout(() => {
      setCurrentSpread(prev => dir === 'next' ? prev + 1 : prev - 1);
      setFlipping(false);
      setFlipDir(null);
    }, 600);
  };

  const leftPage = currentSpread * 2 + 1;
  const rightPage = currentSpread * 2 + 2;

  return (
    <div className="ow-modal-overlay" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 1100, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Header */}
        <div className="ow-book-header">
          <div>
            <div className="ow-book-title">{story.emoji} {story.title}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 700, marginTop: 4 }}>
              {story.child} • {story.language} • {story.values.join(', ')}
            </div>
          </div>
          <button className="ow-book-close" onClick={onClose}>✕</button>
        </div>

        {/* 3D Book Scene */}
        <div className="ow-book-scene">
          {error ? (
            <div style={{ background: '#FEF2F2', border: '2px dashed #FECACA', padding: 40, borderRadius: 16, textAlign: 'center', color: '#DC2626', fontWeight: 600 }}>
              Failed to load book columns. Ensure your Supabase Storage bucket is fully <strong>Public</strong>.
            </div>
          ) : (
            <Document 
              file={story.pdf ? `${API_BASE}/proxy-pdf?url=${encodeURIComponent(story.pdf)}` : null}
              onLoadSuccess={onDocumentLoadSuccess} 
              onLoadError={onDocumentLoadError}
              loading={<div style={{color:'white', padding: 40, fontSize: 18, fontWeight: 800}}>✨ Opening magical book...</div>}
            >
              {numPages && (
                <div className="ow-book-spread" style={{ transform: 'perspective(2000px) rotateX(2deg)' }}>
                  
                  {/* Left Page */}
                  <div className={`ow-page-left ${flipping && flipDir === 'prev' ? 'ow-flip-right' : ''} ${flipping && flipDir === 'next' ? 'ow-flip-left' : ''}`}>
                    {leftPage <= numPages ? (
                      <Page pageNumber={leftPage} width={pageWidth} renderTextLayer={false} renderAnnotationLayer={false} />
                    ) : (
                      <div style={{ width: pageWidth, height: '100%', background: 'var(--input-bg)' }} />
                    )}
                  </div>

                  <div className="ow-book-spine" />

                  {/* Right Page */}
                  <div className={`ow-page-right ${flipping && flipDir === 'next' ? 'ow-flip-right' : ''} ${flipping && flipDir === 'prev' ? 'ow-flip-left' : ''}`}>
                    {rightPage <= numPages ? (
                      <Page pageNumber={rightPage} width={pageWidth} renderTextLayer={false} renderAnnotationLayer={false} />
                    ) : (
                      <div style={{ width: pageWidth, height: '100%', background: 'var(--input-bg)' }} />
                    )}
                  </div>

                </div>
              )}
            </Document>
          )}
        </div>

        {/* Controls */}
        <div className="ow-book-controls">
          <button className="ow-ctrl-btn" disabled={currentSpread === 0 || flipping || error || !numPages} onClick={() => flip('prev')}>←</button>
          
          <div className="ow-page-indicator">
            {numPages ? `${leftPage} – ${rightPage <= numPages ? rightPage : numPages} / ${numPages}` : "Loading..."}
          </div>
          
          <button className="ow-ctrl-btn" disabled={currentSpread >= totalSpreads - 1 || flipping || error || !numPages} onClick={() => flip('next')}>→</button>
          
          <div style={{width: '2px', height: '32px', background: 'var(--border-color)', margin: '0 8px'}} />
          
          <button className="ow-order-btn" onClick={onOrder}>🚀 Order Like This</button>
        </div>

      </div>
    </div>
  );
}

// ── COMPONENT: MAIN PAGE ──
export default function OurWork() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('storykid-theme') === 'dark';
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('storykid-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    fetch(`${API_BASE}/stories`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Soft warm colors for covers if image is missing
          const uiColors = ["#E76F51", "#F4A261", "#2A9D8F", "#E9C46A", "#8AB17D", "#5C7A92"];
          
          const formattedStories = data.stories
            .filter(s => s.published !== false)
            .map((s, index) => ({
              id: s.id,
              title: s.title || "Untitled Story",
              child: s.subtitle || "A StoryKid Hero",
              language: s.language || "English",
              values: ["Adventure", "Magic"], 
              cover: s.cover_url,
              pdf: s.pdf_url,
              color: uiColors[index % uiColors.length], 
              emoji: "📖", 
            }));
            
          setStories(formattedStories);
        }
      })
      .catch(err => console.error("Failed to fetch stories:", err))
      .finally(() => setLoading(false));
  }, []);

  const goToOrder = () => {
    setSelected(null);
    navigate('/order');
  };

  return (
    <>
      <style>{css}</style>
      <div className={`ow-root ${isDark ? 'dark-mode' : ''}`}>

        <BackgroundBlobs />

        {/* Nav */}
        <nav className="ow-nav">
          <button type="button" className="ow-nav-logo" onClick={() => navigate('/')} aria-label="Go to Home">
            <img src="/logo/logo.png" alt="StoryKid logo" className="ow-logo-img" />
          </button>
          <div className="ow-nav-controls">
            <button 
              className="ow-theme-btn" 
              onClick={() => setIsDark(!isDark)}
              aria-label="Toggle Dark Mode"
            >
              {isDark ? '🌙' : '☀️'}
            </button>
            <button className="ow-btn-outline" onClick={() => navigate('/')}>← Home</button>
            <button className="ow-btn-primary" onClick={goToOrder}>🚀 Order My Story</button>
          </div>
        </nav>

        {/* Hero */}
        <div className="ow-hero">
          <div className="ow-hero-tag">Portfolio</div>
          <h1 className="ow-hero-title">
            Our Magical Library
          </h1>
          <p className="ow-hero-sub">Click any book to open it and flip through the pages</p>
        </div>

        {/* Grid */}
        <div className="ow-grid-wrap">
          {loading ? (
            <div style={{textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0', fontSize: 18, fontWeight: 700}}>Loading stories...</div>
          ) : stories.length === 0 ? (
            <div style={{textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0', fontSize: 18, fontWeight: 700}}>No published stories found.</div>
          ) : (
            <div className="ow-grid">
              {stories.map(story => (
                <div key={story.id} className="ow-card" onClick={() => setSelected(story)}>
                  
                  <div className="ow-card-cover" style={{background: `linear-gradient(135deg, ${story.color}22, ${story.color}11)`}}>
                    <div className="ow-card-cover-bg" style={{color: story.color}}>{story.emoji}</div>
                    
                    {story.cover && (
                      <img src={story.cover} alt={story.title} className="ow-card-image" />
                    )}
                    
                    <div className="ow-card-overlay">
                      <button className="ow-card-open-btn">📖 Open Book</button>
                    </div>
                  </div>

                  <div className="ow-card-info">
                    <div className="ow-card-title">{story.emoji} {story.title}</div>
                    <div className="ow-card-meta">
                      <span className="ow-card-tag">{story.child}</span>
                      <span className="ow-card-tag">{story.language}</span>
                      {story.values.map(v => <span key={v} className="ow-card-tag">{v}</span>)}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Book Viewer Modal */}
        {selected && (
          <BookViewer
            story={selected}
            onClose={() => setSelected(null)}
            onOrder={goToOrder}
          />
        )}

      </div>
    </>
  );
}