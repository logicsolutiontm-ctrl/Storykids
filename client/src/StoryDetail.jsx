import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { API_BASE } from './api'
import GalleryCarousel from './components/GalleryCarousel'

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

  .sd-root {
    min-height: 100vh;
    background-color: var(--bg-main);
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
    font-family: 'Nunito', sans-serif;
    color: var(--text-main);
    overflow-x: hidden;
    position: relative;
    transition: background-color 0.4s, color 0.4s;
    padding-bottom: 80px;
  }

  /* ── BACKGROUND BLOBS ── */
  .sd-bg-blob {
    position: fixed; border-radius: 50%; filter: blur(80px); opacity: 0.15;
    animation: floatBlob var(--dur) ease-in-out infinite alternate;
    z-index: 0; pointer-events: none;
  }
  .sd-blob-1 { width: 50vw; height: 50vw; background: var(--primary-light); top: -10vh; left: -10vw; --dur: 15s; }
  .sd-blob-2 { width: 40vw; height: 40vw; background: var(--accent); bottom: -10vh; right: -5vw; --dur: 18s; animation-delay: -5s; }

  @keyframes floatBlob { 
    0% { transform: translate(0, 0) scale(1); } 
    100% { transform: translate(5vw, 5vh) scale(1.05); } 
  }

  /* ── NAV ── */
  .sd-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 48px;
    background: var(--nav-bg);
    backdrop-filter: blur(12px);
    border-bottom: 2px dashed var(--border-color);
    transition: background-color 0.4s, border-color 0.4s;
  }
  .sd-nav-logo {
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
  .sd-nav-logo:hover {
    transform: translateY(-1px);
    border-color: var(--primary-main);
    background: rgba(255,255,255,0.25);
  }
  .sd-logo-img {
    width: 42px;
    height: 42px;
    object-fit: cover;
    border-radius: 16px;
  }
  .sd-nav-controls {
    display: flex; gap: 12px; align-items: center;
  }
  .sd-theme-btn {
    width: 44px; height: 44px; border-radius: 12px;
    background: var(--card-bg); border: 2px solid var(--border-color);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; cursor: pointer; transition: all 0.2s;
    box-shadow: 3px 3px 0px rgba(0,0,0,0.05); color: var(--text-main);
  }
  .sd-theme-btn:hover {
    background: var(--input-bg); border-color: var(--primary-light);
    transform: translate(-2px, -2px); box-shadow: 5px 5px 0px rgba(0,0,0,0.08);
  }

  /* BUTTONS */
  .sd-btn-outline {
    padding: 10px 24px; border-radius: 12px; 
    border: 2px solid var(--border-color); background: var(--card-bg);
    color: var(--text-muted); font-family: 'Nunito', sans-serif;
    font-size: 14px; font-weight: 800; cursor: pointer; transition: all 0.2s;
  }
  .sd-btn-outline:hover {
    background: var(--input-bg); color: var(--text-main); 
    transform: translate(-2px, -2px); box-shadow: 4px 4px 0px rgba(0,0,0,0.05);
  }
  
  .sd-btn-primary { 
    padding: 16px 32px; border-radius: 12px; border: 2px solid var(--text-main); 
    background: var(--primary-main); color: white; 
    font-family: 'Nunito', sans-serif; font-size: 18px; font-weight: 800; 
    cursor: pointer; transition: all 0.2s; 
    box-shadow: 4px 4px 0px var(--btn-shadow);
    width: 100%; display: flex; justify-content: center; align-items: center; gap: 8px;
  }
  .sd-btn-primary:hover { 
    transform: translate(-2px, -2px); box-shadow: 6px 6px 0px var(--btn-shadow); background: var(--primary-dark); 
  }
  .sd-btn-primary:active { transform: translate(2px, 2px); box-shadow: 0px 0px 0px transparent; }

  /* ── LAYOUT ── */
  .sd-container {
    max-width: 1200px; margin: 120px auto 0; padding: 0 24px;
    position: relative; z-index: 1;
  }
  .sd-split {
    display: grid; grid-template-columns: 1fr 1fr; gap: 60px;
    align-items: start; margin-bottom: 60px;
  }

  /* ── LEFT: GALLERY ── */
  .sd-gallery-wrapper {
    background: var(--card-bg); border: 2px solid var(--border-color);
    padding: 16px; border-radius: 16px;
    box-shadow: 6px 6px 0px rgba(0,0,0,0.04);
    position: sticky; top: 120px;
  }
  .sd-gallery-inner {
    border-radius: 8px; overflow: hidden;
    border: 2px dashed var(--border-color);
  }

  /* ── RIGHT: DETAILS ── */
  .sd-tag {
    display: inline-block; padding: 6px 16px; border-radius: 8px;
    background: rgba(42, 157, 143, 0.1); border: 2px solid rgba(42, 157, 143, 0.2);
    color: var(--accent); font-size: 14px; font-weight: 800; letter-spacing: 1px;
    text-transform: uppercase; margin-bottom: 16px;
  }
  .sd-title {
    font-family: 'Baloo 2', cursive; font-size: clamp(36px, 4vw, 48px);
    font-weight: 800; margin-bottom: 12px; line-height: 1.1; color: var(--text-main);
  }
  .sd-price-row {
    display: flex; align-items: center; gap: 16px; margin-bottom: 24px;
  }
  .sd-price { font-size: 28px; font-weight: 800; color: var(--primary-main); }
  .sd-stars { color: #FBBF24; font-size: 18px; letter-spacing: 2px; }
  .sd-reviews-count { color: var(--text-muted); font-size: 14px; font-weight: 700; letter-spacing: 0; }
  
  .sd-desc {
    color: var(--text-muted); font-size: 18px; line-height: 1.6;
    margin-bottom: 32px; font-weight: 600;
  }

  .sd-specs-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
    background: var(--highlight-bg); border: 2px dashed var(--border-color);
    padding: 24px; border-radius: 16px; margin-bottom: 32px;
  }
  .sd-spec-item { display: flex; flex-direction: column; gap: 4px; }
  .sd-spec-label { font-size: 13px; color: var(--text-muted); font-weight: 800; text-transform: uppercase; }
  .sd-spec-val { font-size: 16px; color: var(--text-main); font-weight: 700; }

  .sd-benefits { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
  .sd-benefit { display: flex; align-items: flex-start; gap: 12px; font-size: 16px; color: var(--text-main); font-weight: 600; }
  .sd-benefit-icon { color: var(--accent); font-size: 20px; line-height: 1; }

  /* ── REVIEWS SECTION ── */
  .sd-section-title {
    font-family: 'Baloo 2', cursive; font-size: 32px; font-weight: 800;
    margin-bottom: 32px; text-align: center; color: var(--text-main);
    border-top: 2px dashed var(--border-color); padding-top: 60px;
  }
  .sd-reviews-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
  
  .sd-review-card { 
    text-align: left; padding: 32px 24px; background: var(--card-bg); 
    border-radius: 4px; border: 12px solid var(--card-bg); 
    box-shadow: 0 10px 25px rgba(0,0,0,0.05), 0 2px 5px rgba(0,0,0,0.02); 
    transition: transform 0.3s;
  }
  .sd-review-card:nth-child(even) { transform: rotate(1deg); }
  .sd-review-card:nth-child(odd) { transform: rotate(-1deg); }
  .sd-review-card:hover { transform: translateY(-4px) rotate(0deg); z-index: 10; position: relative;}
  
  .sd-review-text { font-size: 16px; line-height: 1.6; color: var(--text-main); font-style: italic; margin-bottom: 20px; }
  .sd-review-author { font-weight: 800; color: var(--primary-main); font-family: 'Baloo 2', cursive; font-size: 18px; text-align: right; }

  /* ── LOADING & ERROR ── */
  .sd-spinner {
    width: 48px; height: 48px; border: 4px solid var(--border-color);
    border-top-color: var(--primary-main); border-radius: 50%;
    animation: spin 0.85s linear infinite; margin: 100px auto;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 900px) {
    .sd-split { grid-template-columns: 1fr; gap: 40px; }
    .sd-gallery-wrapper { position: relative; top: 0; }
  }
`

function BackgroundBlobs() {
  return (
    <>
      <div className="sd-bg-blob sd-blob-1" />
      <div className="sd-bg-blob sd-blob-2" />
    </>
  )
}

export default function StoryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [story, setStory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('storykid-theme') === 'dark'
  })

  useEffect(() => {
    localStorage.setItem('storykid-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const storyPrice = story?.price || 25
  const storyAge = story?.age_range || '2-12'
  const storyPages = story?.page_count || 28
  const storyBinding = story?.binding || 'Sewn Hardcover'

  // parse reviews from story data
  let storyReviews = []
  let reviewsCount = 2300
  if (story) {
    if (story.reviews_json) {
      try {
        const parsed = typeof story.reviews_json === 'string' ? JSON.parse(story.reviews_json) : story.reviews_json
        storyReviews = Array.isArray(parsed) ? parsed : []
      } catch {
        storyReviews = []
      }
    }
    reviewsCount = story.reviews_count || 2300
  }

  useEffect(() => {
    const loadStory = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE}/stories/${id}`)
        const d = await res.json()
        if (d.success && d.story) setStory(d.story)
        else if (d.success && d.stories) setStory(d.stories[0])
        else setStory(d)
      } catch {
        setStory(null)
      } finally {
        setLoading(false)
      }
    }
    loadStory()
  }, [id])

  if (loading) {
    return (
      <div className={`sd-root ${isDark ? 'dark-mode' : ''}`}>
        <style>{css}</style>
        <BackgroundBlobs />
        <div className="sd-spinner" />
      </div>
    )
  }

  if (!story) {
    return (
      <div className={`sd-root ${isDark ? 'dark-mode' : ''}`}>
        <style>{css}</style>
        <BackgroundBlobs />
        <div style={{textAlign:'center', marginTop:120, fontSize: 20, fontWeight: 800}}>Story not found.</div>
      </div>
    )
  }

  // resolve cover URL from possible fields and provide a safe fallback
  const coverSrc = story.cover_url || story.cover || story.coverUrl || story.image || ''
  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="840"><rect width="100%" height="100%" fill="${isDark ? '#362E28' : '#FFF9F2'}"/><text x="50%" y="50%" font-size="24" fill="${isDark ? '#F4A261' : '#E76F51'}" font-family="sans-serif" font-weight="bold" text-anchor="middle" dominant-baseline="middle">No cover available</text></svg>`
  const placeholder = `data:image/svg+xml;utf8,${encodeURIComponent(svgStr)}`

  // parse gallery urls if present and prepare images array (cover first)
  let galleryUrls = []
  if (story) {
    if (Array.isArray(story.gallery_urls)) galleryUrls = story.gallery_urls
    else if (typeof story.gallery_urls === 'string' && story.gallery_urls.length) {
      try { galleryUrls = JSON.parse(story.gallery_urls) } catch { galleryUrls = [] }
    } else if (story.gallery && Array.isArray(story.gallery)) galleryUrls = story.gallery
  }
  const images = []
  if (coverSrc) images.push(coverSrc)
  images.push(...(galleryUrls || []))

  return (
    <>
      <style>{css}</style>
      <div className={`sd-root ${isDark ? 'dark-mode' : ''}`}>
        
        <BackgroundBlobs />

        {/* Nav */}
        <nav className="sd-nav">
          <button type="button" className="sd-nav-logo" onClick={() => navigate('/')} aria-label="Go to Home">
            <img src="/logo/logo.png" alt="StoryKid logo" className="sd-logo-img" />
          </button>
          <div className="sd-nav-controls">
            <button 
              className="sd-theme-btn" 
              onClick={() => setIsDark(!isDark)}
              aria-label="Toggle Dark Mode"
            >
              {isDark ? '🌙' : '☀️'}
            </button>
            <button className="sd-btn-outline" onClick={() => navigate('/our-work')}>← Library</button>
          </div>
        </nav>

        <div className="sd-container">
          
          <div className="sd-split">
            {/* Left: Interactive Visuals */}
            <div>
              <div className="sd-gallery-wrapper">
                <div className="sd-gallery-inner">
                  <GalleryCarousel images={images} placeholder={placeholder} />
                </div>
              </div>
            </div>

            {/* Right: Details & Checkout */}
            <div>
              <div className="sd-tag">Personalized Keepsake</div>
              <h1 className="sd-title">{story.title || 'Your Child, The Hero'}</h1>
              
              <div className="sd-price-row">
                <div className="sd-price">€{storyPrice}</div>
                <div className="sd-stars">★★★★★ <span className="sd-reviews-count">({reviewsCount.toLocaleString()} reviews)</span></div>
              </div>

              <div className="sd-desc">
                {story.description || story.subtitle || 'A beautifully written adventure that puts your child in the center of a magical journey. Each story is hand-crafted to teach kindness, courage, and imagination while celebrating your child’s uniqueness.'}
              </div>

              <div className="sd-specs-grid">
                <div className="sd-spec-item">
                  <span className="sd-spec-label">Language</span>
                  <span className="sd-spec-val">{story.language || 'English'}</span>
                </div>
                <div className="sd-spec-item">
                  <span className="sd-spec-label">Age Range</span>
                  <span className="sd-spec-val">{storyAge}</span>
                </div>
                <div className="sd-spec-item">
                  <span className="sd-spec-label">Length</span>
                  <span className="sd-spec-val">{storyPages} Pages</span>
                </div>
                <div className="sd-spec-item">
                  <span className="sd-spec-label">Format</span>
                  <span className="sd-spec-val">{storyBinding}</span>
                </div>
              </div>

              <div className="sd-benefits">
                <div className="sd-benefit">
                  <span className="sd-benefit-icon">✨</span>
                  <span>Personalized hero with your child's name and likeness</span>
                </div>
                <div className="sd-benefit">
                  <span className="sd-benefit-icon">💎</span>
                  <span>Values-based storylines to encourage kindness and courage</span>
                </div>
                <div className="sd-benefit">
                  <span className="sd-benefit-icon">📦</span>
                  <span>Premium keepsake printing and fast worldwide delivery</span>
                </div>
              </div>

              <div style={{display: 'flex', gap: '16px', flexDirection: 'column'}}>
                <button 
                  className="sd-btn-primary" 
                  onClick={() => navigate('/order', { state: { storyId: id, title: story.title, price: storyPrice, cover: story.cover_url } })}
                >
                  🚀 Order This Story
                </button>
                
                {story.pdf_url && (
                  <button 
                    className="sd-btn-outline" 
                    onClick={() => window.open(`${API_BASE}/proxy-pdf?url=${encodeURIComponent(story.pdf_url)}`, '_blank')}
                    style={{width: '100%'}}
                  >
                    📖 Preview Full Book
                  </button>
                )}
              </div>
              
              <div style={{marginTop: '16px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600}}>
                🔒 Secure checkout • 256-bit SSL
              </div>

            </div>
          </div>

          {/* Reviews Section */}
          <div>
            <h2 className="sd-section-title">Loved by Parents</h2>
            <div className="sd-reviews-grid">
              {storyReviews.length > 0 ? (
                storyReviews.map((review, i) => (
                  <div key={i} className="sd-review-card">
                    <div className="sd-stars" style={{marginBottom: 16}}>★★★★★</div>
                    <div className="sd-review-text">"{review.text}"</div>
                    <div className="sd-review-author">— {review.author}</div>
                  </div>
                ))
              ) : (
                <div style={{gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', padding: '40px'}}>
                  No reviews yet. Be the first to experience the magic!
                </div>
              )}
            </div>
          </div>

          <footer style={{marginTop: 80, borderTop: '2px dashed var(--border-color)', paddingTop: 40, color:'var(--text-muted)', fontWeight: 600}}>
            <div style={{display:'flex', justifyContent:'space-between', gap:20, flexWrap:'wrap'}}>
              <div>✨ StoryKid © 2026</div>
              <div>Privacy · Terms · Contact</div>
            </div>
          </footer>

        </div>
      </div>
    </>
  )
}