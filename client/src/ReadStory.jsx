import { useEffect, useState } from 'react'
import { API_BASE } from './api'
import { useParams, useNavigate } from 'react-router-dom'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;800&family=Nunito:wght@400;600;700;800&display=swap');
  .rs-root { font-family: 'Nunito', sans-serif; min-height:100vh; padding:48px 20px; background: radial-gradient(ellipse at top, #1a0730 0%, #07020b 60%); color:white; }
  .rs-wrap { max-width:900px; margin:0 auto; }
  .rs-title { font-family:'Baloo 2', cursive; font-size: clamp(26px, 3.6vw, 40px); margin:0 0 12px 0; }
  .rs-cover { width:320px; border-radius:12px; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,0.6); margin-bottom:18px; }
  .rs-content { background: rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.04); padding:28px; border-radius:12px; color: rgba(255,255,255,0.92); line-height:1.7; }
  .btn-plain { background:transparent; border:1px solid rgba(255,255,255,0.06); color:#c084fc; padding:10px 14px; border-radius:10px; cursor:pointer; }
`

export default function ReadStory() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [story, setStory] = useState(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) return <div style={{padding:40}}>Loading...</div>
  if (!story) return <div style={{padding:40}}>Story not found.</div>
  const content = story.content || story.full_text || story.body || story.pages?.join('\n\n')
  const coverSrc = story.cover_url || story.cover || story.coverUrl || ''
  const placeholder = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="840"><rect width="100%" height="100%" fill="%232d1b69"/><text x="50%" y="50%" font-size="24" fill="%23fff" text-anchor="middle" dominant-baseline="middle">No cover available</text></svg>')}`
  return (
    <div className="rs-root">
      <style>{css}</style>
      <div className="rs-wrap">
        <button onClick={() => navigate(-1)} className="btn-plain" style={{marginBottom:16}}>← Back</button>
        <h1 className="rs-title">{story.title || 'Untitled'}</h1>

        {coverSrc ? <div className="rs-cover" style={{display:'flex', alignItems:'center', justifyContent:'center', background:'#fff'}}><img src={coverSrc} alt="cover" style={{maxWidth:'100%', maxHeight:'70vh', objectFit:'contain', display:'block'}} onError={(e)=>{e.currentTarget.onerror=null; e.currentTarget.src=placeholder}} /></div> : null}

        {content ? (
          <div className="rs-content">{content}</div>
        ) : story.pdf_url ? (
          <div className="rs-content" style={{padding:0}}>
            <iframe src={`${API_BASE}/proxy-pdf?url=${encodeURIComponent(story.pdf_url)}`} title="story-pdf" style={{width:'100%', height:'80vh', border:0}} />
          </div>
        ) : (
          <div className="rs-content">Full story text is not available.</div>
        )}
      </div>
    </div>
  )
}
