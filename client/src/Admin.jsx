import { useState, useEffect } from 'react'
import { API_BASE } from './api'
const STATUS_COLORS = {
  new:         { bg: 'rgba(245,158,11,0.2)',  border: 'rgba(245,158,11,0.5)',  text: '#fbbf24', label: '🆕 New' },
  in_progress: { bg: 'rgba(99,102,241,0.2)',  border: 'rgba(99,102,241,0.5)',  text: '#818cf8', label: '⚙️ In Progress' },
  done:        { bg: 'rgba(16,185,129,0.2)',  border: 'rgba(16,185,129,0.5)',  text: '#34d399', label: '✅ Done' },
  shipped:     { bg: 'rgba(30,144,255,0.2)',  border: 'rgba(30,144,255,0.5)',  text: '#60a5fa', label: '📦 Shipped' },
}

const LANGS = ['English', 'Arabic', 'French', 'Turkish', 'Spanish', 'Russian']

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;800&family=Nunito:wght@400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .ad-root { min-height: 100vh; background: linear-gradient(135deg, #0f0a1e 0%, #1a0f3a 50%, #0a1628 100%); font-family: 'Nunito', sans-serif; color: white; }
  .ad-topbar { background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(20px); padding: 16px 32px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
  .ad-logo { font-family: 'Baloo 2', cursive; font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #a855f7, #6366f1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .ad-topbar-right { display: flex; align-items: center; gap: 16px; }
  .ad-live-dot { width: 8px; height: 8px; border-radius: 50%; background: #34d399; box-shadow: 0 0 8px #34d399; animation: blink 2s ease-in-out infinite; }
  @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
  .ad-live-text { font-size: 13px; color: rgba(255,255,255,0.4); }

  /* TABS */
  .ad-tabs { display: flex; gap: 4px; padding: 20px 32px 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .ad-tab { padding: 12px 24px; border-radius: 12px 12px 0 0; border: 1px solid transparent; background: transparent; color: rgba(255,255,255,0.4); font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
  .ad-tab:hover { color: white; background: rgba(255,255,255,0.05); }
  .ad-tab.active { background: rgba(168,85,247,0.15); border-color: rgba(168,85,247,0.3); color: #c084fc; border-bottom-color: transparent; }

  /* STATS */
  .ad-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; padding: 24px 32px; }
  .ad-stat { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px 24px; transition: all 0.2s; }
  .ad-stat:hover { background: rgba(255,255,255,0.08); transform: translateY(-2px); }
  .ad-stat-val { font-family: 'Baloo 2', cursive; font-size: 36px; font-weight: 800; background: linear-gradient(135deg, #a855f7, #6366f1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .ad-stat-label { font-size: 13px; color: rgba(255,255,255,0.4); margin-top: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

  /* TOOLBAR */
  .ad-toolbar { display: flex; align-items: center; gap: 12px; padding: 0 32px 20px; flex-wrap: wrap; }
  .ad-search { flex: 1; min-width: 200px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 11px 16px; color: white; font-family: 'Nunito', sans-serif; font-size: 14px; outline: none; transition: all 0.2s; }
  .ad-search::placeholder { color: rgba(255,255,255,0.25); }
  .ad-search:focus { border-color: rgba(168,85,247,0.6); background: rgba(168,85,247,0.08); }
  .ad-filter-btn { padding: 10px 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.6); font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
  .ad-filter-btn:hover { background: rgba(168,85,247,0.2); color: white; border-color: rgba(168,85,247,0.4); }
  .ad-filter-btn.active { background: linear-gradient(135deg, rgba(168,85,247,0.4), rgba(99,102,241,0.4)); color: white; border-color: rgba(168,85,247,0.7); }
  .ad-refresh-btn { padding: 10px 18px; border-radius: 10px; border: none; background: linear-gradient(135deg, #a855f7, #6366f1); color: white; font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 14px rgba(168,85,247,0.4); }
  .ad-refresh-btn:hover { transform: translateY(-1px); }

  /* TABLE */
  .ad-table-wrap { padding: 0 32px 40px; overflow-x: auto; }
  .ad-table { width: 100%; border-collapse: separate; border-spacing: 0 8px; }
  .ad-table th { text-align: left; font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 1px; padding: 0 16px 8px; }
  .ad-row { background: rgba(255,255,255,0.04); border-radius: 14px; transition: all 0.2s; cursor: pointer; animation: rowIn 0.3s ease; }
  @keyframes rowIn { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:translateY(0);} }
  .ad-row:hover { background: rgba(168,85,247,0.1); transform: translateX(4px); }
  .ad-row td { padding: 16px; font-size: 14px; color: rgba(255,255,255,0.8); }
  .ad-row td:first-child { border-radius: 14px 0 0 14px; }
  .ad-row td:last-child { border-radius: 0 14px 14px 0; }
  .ad-child-name { font-weight: 700; color: white; font-size: 15px; }
  .ad-child-age { font-size: 12px; color: rgba(255,255,255,0.35); margin-top: 2px; }
  .ad-lang-badge { background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.4); color: #a5b4fc; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 8px; }
  .ad-values { font-size: 12px; color: rgba(255,255,255,0.5); max-width: 160px; }
  .ad-email { font-size: 13px; color: #a5b4fc; }
  .ad-photo-thumb { width: 40px; height: 40px; border-radius: 10px; object-fit: cover; border: 2px solid rgba(168,85,247,0.4); }
  .ad-no-photo { width: 40px; height: 40px; border-radius: 10px; background: rgba(255,255,255,0.06); border: 2px dashed rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 16px; }
  .ad-date { font-size: 12px; color: rgba(255,255,255,0.3); }
  .ad-status-select { background: transparent; border: 1px solid; border-radius: 8px; padding: 5px 10px; font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; outline: none; transition: all 0.2s; }

  /* MODAL */
  .ad-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; }
  @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
  .ad-modal { background: linear-gradient(135deg, #1a0f3a, #0f1a2e); border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; padding: 36px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; animation: modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1); box-shadow: 0 40px 100px rgba(0,0,0,0.6); }
  @keyframes modalIn { from{opacity:0;transform:scale(0.9) translateY(20px);} to{opacity:1;transform:scale(1) translateY(0);} }
  .ad-modal-title { font-family:'Baloo 2',cursive; font-size:22px; font-weight:800; color:white; margin-bottom:24px; }
  .ad-modal-row { display:flex; gap:8px; align-items:flex-start; margin-bottom:14px; font-size:14px; color:rgba(255,255,255,0.75); }
  .ad-modal-row span:first-child { font-size:18px; flex-shrink:0; }
  .ad-modal-row strong { color:white; }
  .ad-modal-close { width:100%; padding:14px; border-radius:14px; border:none; margin-top:24px; background:linear-gradient(135deg,#a855f7,#6366f1); color:white; font-family:'Nunito',sans-serif; font-size:15px; font-weight:700; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 20px rgba(168,85,247,0.4); }
  .ad-modal-close:hover { transform:translateY(-2px); }
  .ad-modal-photo { width:100%; border-radius:14px; margin-bottom:20px; border:2px solid rgba(168,85,247,0.3); }
  .ad-modal-section { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:16px; margin-bottom:16px; }
  .ad-modal-section-title { font-size:11px; font-weight:700; color:rgba(255,255,255,0.35); text-transform:uppercase; letter-spacing:1px; margin-bottom:12px; }
  .ad-special { background:rgba(168,85,247,0.08); border:1px solid rgba(168,85,247,0.2); border-radius:12px; padding:14px; font-size:14px; color:rgba(255,255,255,0.7); line-height:1.6; font-style:italic; }

  /* STORIES TAB */
  .ad-stories-toolbar { display:flex; align-items:center; justify-content:space-between; padding:24px 32px 20px; flex-wrap:wrap; gap:12px; }
  .ad-add-btn { padding:12px 24px; border-radius:12px; border:none; background:linear-gradient(135deg,#a855f7,#6366f1); color:white; font-family:'Nunito',sans-serif; font-size:14px; font-weight:700; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 16px rgba(168,85,247,0.4); }
  .ad-add-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(168,85,247,0.5); }
  .ad-stories-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; padding:0 32px 40px; }
  .ad-story-card { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:20px; overflow:hidden; transition:all 0.3s; animation:rowIn 0.3s ease; }
  .ad-story-card:hover { transform:translateY(-4px); border-color:rgba(168,85,247,0.3); box-shadow:0 20px 40px rgba(0,0,0,0.4); }
  .ad-story-cover { width:100%; height:160px; object-fit:cover; background:rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center; font-size:40px; }
  .ad-story-cover img { width:100%; height:100%; object-fit:cover; }
  .ad-story-body { padding:16px; }
  .ad-story-title { font-family:'Baloo 2',cursive; font-size:17px; font-weight:700; color:white; margin-bottom:4px; }
  .ad-story-sub { font-size:13px; color:rgba(255,255,255,0.4); margin-bottom:12px; }
  .ad-story-actions { display:flex; gap:8px; }
  .ad-story-btn { flex:1; padding:8px; border-radius:10px; border:1px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.6); font-family:'Nunito',sans-serif; font-size:12px; font-weight:700; cursor:pointer; transition:all 0.2s; text-align:center; }
  .ad-story-btn:hover { background:rgba(168,85,247,0.2); color:white; border-color:rgba(168,85,247,0.4); }
  .ad-story-btn.danger:hover { background:rgba(220,50,50,0.2); color:#ff8080; border-color:rgba(220,50,50,0.4); }
  .ad-published-badge { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:999px; font-size:11px; font-weight:700; }
  .ad-published-badge.on { background:rgba(16,185,129,0.2); border:1px solid rgba(16,185,129,0.4); color:#34d399; }
  .ad-published-badge.off { background:rgba(107,114,128,0.2); border:1px solid rgba(107,114,128,0.4); color:#9ca3af; }

  /* FORM */
  .ad-form-field { margin-bottom:18px; }
  .ad-form-label { display:block; font-size:12px; font-weight:700; color:rgba(255,255,255,0.45); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px; }
  .ad-form-input { width:100%; background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.12); border-radius:12px; padding:12px 16px; color:white; font-family:'Nunito',sans-serif; font-size:14px; outline:none; transition:all 0.2s; }
  .ad-form-input:focus { border-color:rgba(168,85,247,0.7); background:rgba(168,85,247,0.08); box-shadow:0 0 0 3px rgba(168,85,247,0.15); }
  .ad-form-select { width:100%; background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.12); border-radius:12px; padding:12px 16px; color:white; font-family:'Nunito',sans-serif; font-size:14px; outline:none; cursor:pointer; }
  .ad-file-upload { width:100%; min-height:80px; border:2px dashed rgba(168,85,247,0.3); border-radius:12px; background:rgba(168,85,247,0.04); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s; font-size:13px; color:rgba(255,255,255,0.4); gap:8px; }
  .ad-file-upload:hover { border-color:rgba(168,85,247,0.7); background:rgba(168,85,247,0.1); color:white; }
  .ad-file-upload.has-file { border-color:rgba(16,185,129,0.5); background:rgba(16,185,129,0.08); color:#34d399; }
  .ad-submit-btn { width:100%; padding:14px; border-radius:14px; border:none; background:linear-gradient(135deg,#a855f7,#6366f1); color:white; font-family:'Nunito',sans-serif; font-size:15px; font-weight:700; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 20px rgba(168,85,247,0.4); margin-top:8px; }
  .ad-submit-btn:hover { transform:translateY(-2px); }
  .ad-submit-btn:disabled { opacity:0.4; cursor:not-allowed; transform:none; }

  /* EMPTY + LOADING */
  .ad-empty { text-align:center; padding:80px 20px; color:rgba(255,255,255,0.25); font-size:15px; }
  .ad-empty-icon { font-size:48px; display:block; margin-bottom:12px; }
  .ad-loading { text-align:center; padding:80px 20px; }
  .ad-spinner { width:44px; height:44px; border:3px solid rgba(168,85,247,0.15); border-top-color:#a855f7; border-radius:50%; animation:spin 0.85s linear infinite; margin:0 auto 16px; }
  @keyframes spin { to{transform:rotate(360deg);} }
`

function formatDate(str) {
  return new Date(str).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })
}

// ── ORDERS TAB ──
function OrdersTab() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch(API_BASE + '/orders')
      const data = await res.json()
      if (data.success) setOrders(data.orders)
    } catch(e) { console.error(e) }
    finally { setLoading(false); setLastRefresh(new Date()) }
  }

  useEffect(() => {
    const loadOrders = async () => {
      await fetchOrders()
    }
    loadOrders()
    const i = setInterval(loadOrders, 60000)
    return () => clearInterval(i)
  }, [])

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API_BASE}/orders/${id}/status`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
      if (selected?.id === id) setSelected(prev => ({ ...prev, status }))
    } catch(e) { console.error(e) }
  }

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'all' || o.status === filter
    const matchSearch = !search ||
      o.child_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.parent_email?.toLowerCase().includes(search.toLowerCase()) ||
      o.language?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const counts = {
    all: orders.length,
    new: orders.filter(o => o.status === 'new').length,
    in_progress: orders.filter(o => o.status === 'in_progress').length,
    done: orders.filter(o => o.status === 'done').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
  }

  return (
    <>
      <div className="ad-stats">
        {[
          { label: 'Total Orders', val: counts.all, icon: '📦' },
          { label: 'New', val: counts.new, icon: '🆕' },
          { label: 'In Progress', val: counts.in_progress, icon: '⚙️' },
          { label: 'Shipped', val: counts.shipped, icon: '🚀' },
        ].map((s, i) => (
          <div key={i} className="ad-stat">
            <div style={{fontSize:24, marginBottom:8}}>{s.icon}</div>
            <div className="ad-stat-val">{s.val}</div>
            <div className="ad-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="ad-toolbar">
        <input className="ad-search" placeholder="🔍 Search by name, email, language..."
          value={search} onChange={e => setSearch(e.target.value)} />
        {['all','new','in_progress','done','shipped'].map(f => (
          <button key={f} className={`ad-filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}>
            {f === 'all' ? '📋 All' : STATUS_COLORS[f]?.label}
            {counts[f] > 0 && <span style={{marginLeft:6, background:'rgba(255,255,255,0.15)', borderRadius:999, padding:'1px 7px', fontSize:11}}>{counts[f]}</span>}
          </button>
        ))}
        <button className="ad-refresh-btn" onClick={fetchOrders}>🔄 Refresh</button>
        <div style={{color:'rgba(255,255,255,0.4)', fontSize:12}}>
          Last refresh: {formatDate(lastRefresh.toISOString())}
        </div>
      </div>

      <div className="ad-table-wrap">
        {loading ? (
          <div className="ad-loading"><div className="ad-spinner" /><p style={{color:'rgba(255,255,255,0.3)',fontSize:14}}>Loading orders...</p></div>
        ) : filtered.length === 0 ? (
          <div className="ad-empty"><span className="ad-empty-icon">📭</span>No orders found</div>
        ) : (
          <table className="ad-table">
            <thead>
              <tr>
                <th>Child</th><th>Language</th><th>Values</th>
                <th>Email</th><th>Photo</th><th>Date</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => {
                const sc = STATUS_COLORS[order.status] || STATUS_COLORS.new
                return (
                  <tr key={order.id} className="ad-row" onClick={() => setSelected(order)}>
                    <td><div className="ad-child-name">{order.child_name}</div><div className="ad-child-age">Age {order.age}</div></td>
                    <td><span className="ad-lang-badge">{order.language}</span></td>
                    <td><div className="ad-values">{order.values}</div></td>
                    <td><div className="ad-email">{order.parent_email}</div></td>
                    <td>{order.photo_url ? <img src={order.photo_url} className="ad-photo-thumb" alt="child" /> : <div className="ad-no-photo">👤</div>}</td>
                    <td><div className="ad-date">{formatDate(order.created_at)}</div></td>
                    <td onClick={e => e.stopPropagation()}>
                      <select className="ad-status-select"
                        value={order.status}
                        style={{ borderColor: sc.border, color: sc.text, backgroundColor: sc.bg }}
                        onChange={e => updateStatus(order.id, e.target.value)}>
                        <option value="new">🆕 New</option>
                        <option value="in_progress">⚙️ In Progress</option>
                        <option value="done">✅ Done</option>
                        <option value="shipped">📦 Shipped</option>
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="ad-modal-overlay" onClick={() => setSelected(null)}>
          <div className="ad-modal" onClick={e => e.stopPropagation()}>
            <div className="ad-modal-title">📋 Order Details</div>
            {selected.photo_url && <img src={selected.photo_url} className="ad-modal-photo" alt="child" />}
            <div className="ad-modal-section">
              <div className="ad-modal-section-title">Child Info</div>
              <div className="ad-modal-row"><span>👶</span><span><strong>{selected.child_name}</strong>, Age {selected.age}</span></div>
              <div className="ad-modal-row"><span>🌍</span><span>Story in <strong>{selected.language}</strong></span></div>
              <div className="ad-modal-row"><span>🦁</span><span>Loves: <strong>{selected.interests}</strong></span></div>
              {selected.characters && <div className="ad-modal-row"><span>⭐</span><span>Heroes: <strong>{selected.characters}</strong></span></div>}
              <div className="ad-modal-row"><span>💎</span><span>Values: <strong>{selected.values}</strong></span></div>
            </div>
            <div className="ad-modal-section">
              <div className="ad-modal-section-title">Parent Info</div>
              <div className="ad-modal-row"><span>📧</span><span>{selected.parent_email}</span></div>
              <div className="ad-modal-row"><span>🕐</span><span>{formatDate(selected.created_at)}</span></div>
            </div>
            {selected.special_request && (
              <div className="ad-modal-section">
                <div className="ad-modal-section-title">Special Request</div>
                <div className="ad-special">"{selected.special_request}"</div>
              </div>
            )}
            <div className="ad-modal-section">
              <div className="ad-modal-section-title">Update Status</div>
              <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                {Object.entries(STATUS_COLORS).map(([key, sc]) => (
                  <button key={key}
                    onClick={() => updateStatus(selected.id, key)}
                    style={{ padding:'8px 16px', borderRadius:10, border:`1px solid ${sc.border}`, background: selected.status === key ? sc.bg : 'transparent', color: sc.text, fontFamily:'Nunito,sans-serif', fontSize:13, fontWeight:700, cursor:'pointer', transition:'all 0.2s' }}>
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>
            <button className="ad-modal-close" onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  )
}

// ── STORIES TAB ──
function StoriesTab() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editStory, setEditStory] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title:'', subtitle:'', language:'English', published: true })
  const [coverFile, setCoverFile] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])

  useEffect(() => {
    const loadStories = async () => {
      setLoading(true)
      try {
        const res = await fetch(API_BASE + '/stories')
        const data = await res.json()
        if (data.success) setStories(data.stories)
      } catch(e) { console.error(e) }
      finally { setLoading(false) }
    }
    loadStories()
  }, [])

  const openEdit = (story) => {
    setEditStory(story)
    setForm({
      title: story.title || '',
      subtitle: story.subtitle || '',
      language: story.language || 'English',
      published: story.published !== false
    })
    setCoverFile(null)
    setPdfFile(null)
    setGalleryFiles([])
  }

  const openNew = () => {
    setEditStory({ id: 'new' })
    setForm({
      title: '',
      subtitle: '',
      language: 'English',
      published: true
    })
    setCoverFile(null)
    setPdfFile(null)
    setGalleryFiles([])
  }

  const handleSubmit = async () => {
    if (!form.title) {
      alert('❌ Please enter a title')
      return
    }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('subtitle', form.subtitle)
      fd.append('language', form.language)
      fd.append('published', String(form.published))
      if (coverFile) fd.append('cover', coverFile)
      if (pdfFile) fd.append('pdf', pdfFile)
      // append gallery files (can be multiple)
      if (galleryFiles && galleryFiles.length) {
        galleryFiles.forEach(f => fd.append('gallery', f))
      }

      const isNew = editStory.id === 'new'
      const method = isNew ? 'POST' : 'PATCH'
      const endpoint = isNew ? API_BASE + '/stories' : `${API_BASE}/stories/${editStory.id}`

      console.log('📤 Sending:', { method, endpoint, formDataKeys: Array.from(fd.keys()) })

      const res = await fetch(endpoint, {
        method,
        body: fd
      })

      if (!res.ok) {
        const text = await res.text()
        console.error('❌ Server response:', res.status, text)
        throw new Error(`Server error: ${res.status}`)
      }

      const data = await res.json()
      if (data.success) {
        if (isNew) {
          setStories(prev => [...prev, data.story])
        } else {
          setStories(prev => prev.map(s => s.id === editStory.id ? data.story : s))
        }
        setEditStory(null)
        alert('✅ Story saved successfully!')
      } else {
        alert(`❌ Error: ${data.error}`)
      }
    } catch(e) { 
      console.error(e)
      alert(`❌ Upload failed: ${e.message}`)
    }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!editStory || editStory.id === 'new') return
    const confirmed = window.confirm('Are you sure you want to delete this story? This cannot be undone.')
    if (!confirmed) return

    setSaving(true)
    try {
      const res = await fetch(`${API_BASE}/stories/${editStory.id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const text = await res.text()
        console.error('❌ Delete failed:', res.status, text)
        throw new Error(`Server error: ${res.status}`)
      }

      const data = await res.json()
      if (data.success) {
        setStories(prev => prev.filter(s => s.id !== editStory.id))
        setEditStory(null)
        alert('✅ Story deleted successfully!')
      } else {
        alert(`❌ Error: ${data.error}`)
      }
    } catch (e) {
      console.error(e)
      alert(`❌ Delete failed: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="ad-stories-toolbar">
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          <div style={{fontSize:24}}>📚</div>
          <div>
            <div style={{fontFamily:'Baloo 2, cursive', fontSize:18, fontWeight:700}}>Story Portfolio</div>
            <div style={{fontSize:13, color:'rgba(255,255,255,0.35)'}}>{stories.length} stories • click any to edit</div>
          </div>
        </div>
        <button className="ad-add-btn" onClick={openNew}>➕ Add New Story</button>
      </div>

      {loading ? (
        <div className="ad-loading"><div className="ad-spinner" /><p style={{color:'rgba(255,255,255,0.3)',fontSize:14}}>Loading stories...</p></div>
      ) : (
        <div className="ad-stories-grid">
          {stories.map(story => (
            <div key={story.id} className="ad-story-card">
              <div className="ad-story-cover">
                {story.cover_url
                  ? <img src={story.cover_url} alt={story.title} />
                  : <span>📖</span>
                }
              </div>
              <div className="ad-story-body">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6}}>
                  <div className="ad-story-title">{story.title || 'Untitled'}</div>
                  <span className={`ad-published-badge ${story.published ? 'on' : 'off'}`}>
                    {story.published ? '● Live' : '○ Hidden'}
                  </span>
                </div>
                <div className="ad-story-sub">{story.subtitle || 'No subtitle yet'}</div>
                <div style={{marginBottom:12}}>
                  <span className="ad-lang-badge">{story.language}</span>
                  {story.pdf_url
                    ? <span style={{marginLeft:8, fontSize:11, color:'#34d399'}}>✅ PDF ready</span>
                    : <span style={{marginLeft:8, fontSize:11, color:'rgba(255,255,255,0.25)'}}>⚠️ No PDF</span>
                  }
                </div>
                <div className="ad-story-actions">
                  <button className="ad-story-btn" onClick={() => openEdit(story)}>✏️ Edit</button>
                  {story.pdf_url && (
                    <button className="ad-story-btn" onClick={() => window.open(story.pdf_url, '_blank')}>👁️ View PDF</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {editStory && (
        <div className="ad-modal-overlay" onClick={() => setEditStory(null)}>
          <div className="ad-modal" onClick={e => e.stopPropagation()}>
            <div className="ad-modal-title">{editStory.id === 'new' ? '✨ Create New Story' : `✏️ Edit — ${editStory.title || 'Story'}`}</div>

            <div className="ad-form-field">
              <label className="ad-form-label">Title</label>
              <input className="ad-form-input" placeholder="Story title"
                value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} />
            </div>

            <div className="ad-form-field">
              <label className="ad-form-label">Subtitle</label>
              <input className="ad-form-input" placeholder="Short description"
                value={form.subtitle} onChange={e => setForm(p => ({...p, subtitle: e.target.value}))} />
            </div>

            <div className="ad-form-field">
              <label className="ad-form-label">Language</label>
              <select className="ad-form-select" value={form.language}
                onChange={e => setForm(p => ({...p, language: e.target.value}))}>
                {LANGS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div className="ad-form-field">
              <label className="ad-form-label">Cover Image {editStory.cover_url && <span style={{color:'#34d399', fontWeight:400}}>— already uploaded ✅</span>}</label>
              <div className={`ad-file-upload ${coverFile ? 'has-file' : ''}`}
                onClick={() => document.getElementById('coverInput').click()}>
                {coverFile ? `✅ ${coverFile.name}` : '📸 Click to upload new cover'}
              </div>
              <input id="coverInput" type="file" accept="image/*" style={{display:'none'}}
                onChange={e => setCoverFile(e.target.files[0])} />
            </div>

            <div className="ad-form-field">
              <label className="ad-form-label">
                PDF File
                {editStory.pdf_url
                  ? <span style={{color:'#34d399', fontWeight:400}}> — already uploaded ✅</span>
                  : <span style={{color:'#fbbf24', fontWeight:400}}> — not uploaded yet ⚠️</span>
                }
              </label>
              <div className={`ad-file-upload ${pdfFile ? 'has-file' : ''}`}
                onClick={() => document.getElementById('pdfInput').click()}>
                {pdfFile ? `✅ ${pdfFile.name}` : '📄 Click to upload PDF (12" x 8.5")'}
              </div>
              <input id="pdfInput" type="file" accept="application/pdf" style={{display:'none'}}
                onChange={e => setPdfFile(e.target.files[0])} />
            </div>

            <div className="ad-form-field">
              <label className="ad-form-label">Gallery Images {editStory.gallery_urls && <span style={{color:'#34d399', fontWeight:400}}>— existing images</span>}</label>
              <div className={`ad-file-upload ${galleryFiles.length ? 'has-file' : ''}`}
                onClick={() => document.getElementById('galleryInput').click()}>
                {galleryFiles.length ? `✅ ${galleryFiles.length} file(s) selected` : '🖼️ Click to upload 1..12 gallery images'}
              </div>
              <input id="galleryInput" type="file" accept="image/*" multiple style={{display:'none'}}
                onChange={e => setGalleryFiles(Array.from(e.target.files || []))} />

              {/* show existing gallery thumbnails if any */}
              {editStory.gallery_urls && (
                <div style={{display:'flex', gap:8, marginTop:12, flexWrap:'wrap'}}>
                  {(typeof editStory.gallery_urls === 'string' ? (() => { try { return JSON.parse(editStory.gallery_urls) } catch { return [] } })() : editStory.gallery_urls) .map((g, i) => (
                    <img key={i} src={g} alt={`g-${i}`} style={{width:72, height:72, objectFit:'cover', borderRadius:8, border:'1px solid rgba(255,255,255,0.06)'}} />
                  ))}
                </div>
              )}
              {/* preview newly selected files */}
              {galleryFiles.length > 0 && (
                <div style={{display:'flex', gap:8, marginTop:12, flexWrap:'wrap'}}>
                  {galleryFiles.map((f, i) => {
                    const url = URL.createObjectURL(f)
                    return <img key={i} src={url} alt={f.name} style={{width:72, height:72, objectFit:'cover', borderRadius:8, border:'1px solid rgba(255,255,255,0.06)'}} />
                  })}
                </div>
              )}
            </div>

            <div className="ad-form-field">
              <label className="ad-form-label">Visibility</label>
              <div style={{display:'flex', gap:8}}>
                {[true, false].map(val => (
                  <button key={String(val)}
                    onClick={() => setForm(p => ({...p, published: val}))}
                    style={{
                      flex:1, padding:'10px', borderRadius:10,
                      border: form.published === val ? '1px solid rgba(168,85,247,0.6)' : '1px solid rgba(255,255,255,0.1)',
                      background: form.published === val ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.04)',
                      color: form.published === val ? '#c084fc' : 'rgba(255,255,255,0.4)',
                      fontFamily:'Nunito,sans-serif', fontSize:13, fontWeight:700, cursor:'pointer'
                    }}>
                    {val ? '🟢 Visible on site' : '⚫ Hidden'}
                  </button>
                ))}
              </div>
            </div>

            <button className="ad-submit-btn" disabled={!form.title || saving} onClick={handleSubmit}>
              {saving ? '⏳ Saving...' : editStory.id === 'new' ? '✨ Create Story' : '✅ Save Changes'}
            </button>
            {editStory.id !== 'new' && (
              <button className="ad-story-btn"
                style={{
                  width: '100%', marginTop: 12,
                  background: 'rgba(220,50,50,0.18)',
                  border: '1px solid rgba(220,50,50,0.45)',
                  color: '#ff8080',
                  fontWeight: 700
                }}
                onClick={handleDelete}
                disabled={saving}
              >
                🗑️ Delete Story
              </button>
            )}
            <button className="ad-modal-close"
              style={{marginTop:8, background:'rgba(255,255,255,0.06)', boxShadow:'none'}}
              onClick={() => setEditStory(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function StoryPageTab() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    language: 'English',
    published: true,
    price: '25',
    age_range: '2-12',
    page_count: '28',
    binding: 'Sewn Hardcover',
    format: 'Landscape',
    type: 'Adventure',
    description: '',
    long_description: '',
    reviews_json: '[]'
  })
  const [coverFile, setCoverFile] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])

  const loadStories = async () => {
    setLoading(true)
    try {
      const res = await fetch(API_BASE + '/stories')
      const data = await res.json()
      if (data.success) setStories(data.stories)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStories()
  }, [])

  const openDetail = (story) => {
    setSelected(story)
    let parsedReviews = []
    if (story.reviews_json) {
      try { parsedReviews = typeof story.reviews_json === 'string' ? JSON.parse(story.reviews_json) : story.reviews_json } catch { parsedReviews = [] }
    }
    setForm({
      title: story.title || '',
      subtitle: story.subtitle || '',
      language: story.language || 'English',
      published: story.published !== false,
      price: story.price != null ? String(story.price) : '25',
      age_range: story.age_range || '2-12',
      page_count: story.page_count != null ? String(story.page_count) : '28',
      binding: story.binding || 'Sewn Hardcover',
      format: story.format || 'Landscape',
      type: story.type || 'Adventure',
      description: story.description || '',
      long_description: story.long_description || '',
      reviews_json: JSON.stringify(parsedReviews)
    })
    setCoverFile(null)
    setPdfFile(null)
    setGalleryFiles([])
  }

  const handleSave = async () => {
    if (!selected) return
    if (!form.title) {
      alert('❌ Please enter a title')
      return
    }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('subtitle', form.subtitle)
      fd.append('language', form.language)
      fd.append('published', String(form.published))
      fd.append('price', form.price)
      fd.append('age_range', form.age_range)
      fd.append('page_count', form.page_count)
      fd.append('binding', form.binding)
      fd.append('format', form.format)
      fd.append('type', form.type)
      fd.append('description', form.description)
      fd.append('long_description', form.long_description)
      fd.append('reviews_json', form.reviews_json)

      if (coverFile) fd.append('cover', coverFile)
      if (pdfFile) fd.append('pdf', pdfFile)
      if (galleryFiles.length) galleryFiles.forEach(file => fd.append('gallery', file))

      const res = await fetch(`${API_BASE}/stories/${selected.id}`, {
        method: 'PATCH', body: fd
      })

      if (!res.ok) {
        const text = await res.text()
        console.error('❌ Save failed:', res.status, text)
        throw new Error(`Server error ${res.status}`)
      }

      const data = await res.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to save story page')
      }

      setSelected(data.story)
      setStories(prev => prev.map(s => s.id === data.story.id ? data.story : s))
      alert('✅ Story detail page updated successfully')
    } catch (e) {
      console.error(e)
      alert(`❌ Could not save: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  const parseGallery = (story) => {
    if (!story) return []
    if (Array.isArray(story.gallery_urls)) return story.gallery_urls
    if (typeof story.gallery_urls === 'string' && story.gallery_urls.length) {
      try { return JSON.parse(story.gallery_urls) } catch { return [] }
    }
    if (Array.isArray(story.gallery)) return story.gallery
    return []
  }

  return (
    <>
      <div className="ad-stories-toolbar">
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          <div style={{fontSize:24}}>🧩</div>
          <div>
            <div style={{fontFamily:'Baloo 2, cursive', fontSize:18, fontWeight:700}}>Story Detail Pages</div>
            <div style={{fontSize:13, color:'rgba(255,255,255,0.35)'}}>{stories.length} stories • edit page content, price and review data</div>
          </div>
        </div>
        <button className="ad-refresh-btn" onClick={loadStories}>🔄 Refresh</button>
      </div>

      {loading ? (
        <div className="ad-loading"><div className="ad-spinner" /><p style={{color:'rgba(255,255,255,0.3)',fontSize:14}}>Loading story pages...</p></div>
      ) : stories.length === 0 ? (
        <div className="ad-empty"><span className="ad-empty-icon">📭</span>No stories found</div>
      ) : (
        <div className="ad-stories-grid">
          {stories.map(story => (
            <div key={story.id} className="ad-story-card">
              <div className="ad-story-cover">
                {story.cover_url ? <img src={story.cover_url} alt={story.title} /> : <span>📖</span>}
              </div>
              <div className="ad-story-body">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6}}>
                  <div className="ad-story-title">{story.title || 'Untitled'}</div>
                  <span className={`ad-published-badge ${story.published ? 'on' : 'off'}`}>
                    {story.published ? '● Live' : '○ Hidden'}
                  </span>
                </div>
                <div className="ad-story-sub">{story.subtitle || 'Configure story detail page content'}</div>
                <div style={{marginBottom:12}}>
                  <span className="ad-lang-badge">{story.language || 'English'}</span>
                  <span style={{marginLeft:8, fontSize:11, color:'#cfcfcf'}}>€{story.price || 25}</span>
                </div>
                <div className="ad-story-actions">
                  <button className="ad-story-btn" onClick={() => openDetail(story)}>✏️ Manage Page</button>
                  <button className="ad-story-btn" onClick={() => window.open(`/story/${story.id}`, '_blank')}>👁️ Preview</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="ad-modal-overlay" onClick={() => setSelected(null)}>
          <div className="ad-modal" onClick={e => e.stopPropagation()}>
            <div className="ad-modal-title">🧾 Story Detail Page — {selected.title || 'Untitled'}</div>

            <div className="ad-form-field">
              <label className="ad-form-label">Title</label>
              <input className="ad-form-input" value={form.title}
                onChange={e => setForm(p => ({...p, title: e.target.value}))} />
            </div>

            <div className="ad-form-field">
              <label className="ad-form-label">Subtitle</label>
              <input className="ad-form-input" value={form.subtitle}
                onChange={e => setForm(p => ({...p, subtitle: e.target.value}))} />
            </div>

            <div className="ad-form-field">
              <label className="ad-form-label">Language</label>
              <select className="ad-form-select" value={form.language}
                onChange={e => setForm(p => ({...p, language: e.target.value}))}>
                {LANGS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div className="ad-form-field">
              <label className="ad-form-label">Price (€)</label>
              <input className="ad-form-input" type="number" min="0" step="0.01"
                value={form.price} onChange={e => setForm(p => ({...p, price: e.target.value}))} />
            </div>

            <div style={{display:'grid', gap:12, gridTemplateColumns:'1fr 1fr'}}>
              <div className="ad-form-field">
                <label className="ad-form-label">Age Range</label>
                <input className="ad-form-input" value={form.age_range}
                  onChange={e => setForm(p => ({...p, age_range: e.target.value}))} />
              </div>
              <div className="ad-form-field">
                <label className="ad-form-label">Page Count</label>
                <input className="ad-form-input" type="number" min="1" step="1"
                  value={form.page_count} onChange={e => setForm(p => ({...p, page_count: e.target.value}))} />
              </div>
            </div>

            <div style={{display:'grid', gap:12, gridTemplateColumns:'1fr 1fr'}}>
              <div className="ad-form-field">
                <label className="ad-form-label">Binding</label>
                <input className="ad-form-input" value={form.binding}
                  onChange={e => setForm(p => ({...p, binding: e.target.value}))} />
              </div>
              <div className="ad-form-field">
                <label className="ad-form-label">Format</label>
                <input className="ad-form-input" value={form.format}
                  onChange={e => setForm(p => ({...p, format: e.target.value}))} />
              </div>
            </div>

            <div className="ad-form-field">
              <label className="ad-form-label">Story Type</label>
              <input className="ad-form-input" value={form.type}
                onChange={e => setForm(p => ({...p, type: e.target.value}))} />
            </div>

            <div className="ad-form-field">
              <label className="ad-form-label">Short Description</label>
              <textarea className="ad-form-input" style={{minHeight:100}} value={form.description}
                onChange={e => setForm(p => ({...p, description: e.target.value}))} />
            </div>

            <div className="ad-form-field">
              <label className="ad-form-label">Long Description</label>
              <textarea className="ad-form-input" style={{minHeight:120}} value={form.long_description}
                onChange={e => setForm(p => ({...p, long_description: e.target.value}))} />
            </div>

            <div className="ad-form-field">
              <label className="ad-form-label">Cover Image {selected.cover_url && <span style={{color:'#34d399', fontWeight:400}}>— already uploaded ✅</span>}</label>
              <div className={`ad-file-upload ${coverFile ? 'has-file' : ''}`}
                onClick={() => document.getElementById('pageCoverInput').click()}>
                {coverFile ? `✅ ${coverFile.name}` : '📸 Upload new cover image'}
              </div>
              <input id="pageCoverInput" type="file" accept="image/*" style={{display:'none'}}
                onChange={e => setCoverFile(e.target.files[0])} />
            </div>

            <div className="ad-form-field">
              <label className="ad-form-label">PDF File {selected.pdf_url ? <span style={{color:'#34d399', fontWeight:400}}>— already uploaded ✅</span> : ''}</label>
              <div className={`ad-file-upload ${pdfFile ? 'has-file' : ''}`}
                onClick={() => document.getElementById('pagePdfInput').click()}>
                {pdfFile ? `✅ ${pdfFile.name}` : '📄 Upload a PDF for the story detail page'}
              </div>
              <input id="pagePdfInput" type="file" accept="application/pdf" style={{display:'none'}}
                onChange={e => setPdfFile(e.target.files[0])} />
            </div>

            <div className="ad-form-field">
              <label className="ad-form-label">Gallery Images</label>
              <div className={`ad-file-upload ${galleryFiles.length ? 'has-file' : ''}`}
                onClick={() => document.getElementById('pageGalleryInput').click()}>
                {galleryFiles.length ? `✅ ${galleryFiles.length} file(s) selected` : '🖼️ Add gallery images for the page'}
              </div>
              <input id="pageGalleryInput" type="file" accept="image/*" multiple style={{display:'none'}}
                onChange={e => setGalleryFiles(Array.from(e.target.files || []))} />
              <div style={{display:'flex', gap:8, marginTop:12, flexWrap:'wrap'}}>
                {(parseGallery(selected) || []).map((g, i) => (
                  <img key={i} src={g} alt={`gallery-${i}`} style={{width:72, height:72, objectFit:'cover', borderRadius:8, border:'1px solid rgba(255,255,255,0.06)'}} />
                ))}
              </div>
              {galleryFiles.length > 0 && (
                <div style={{display:'flex', gap:8, marginTop:12, flexWrap:'wrap'}}>
                  {galleryFiles.map((f, i) => {
                    const url = URL.createObjectURL(f)
                    return <img key={i} src={url} alt={f.name} style={{width:72, height:72, objectFit:'cover', borderRadius:8, border:'1px solid rgba(255,255,255,0.06)'}} />
                  })}
                </div>
              )}
            </div>

            <div className="ad-form-field">
              <label className="ad-form-label">Visibility</label>
              <div style={{display:'flex', gap:8}}>
                {[true, false].map(val => (
                  <button key={String(val)}
                    onClick={() => setForm(p => ({...p, published: val}))}
                    style={{
                      flex:1, padding:'10px', borderRadius:10,
                      border: form.published === val ? '1px solid rgba(168,85,247,0.6)' : '1px solid rgba(255,255,255,0.1)',
                      background: form.published === val ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.04)',
                      color: form.published === val ? '#c084fc' : 'rgba(255,255,255,0.4)',
                      fontFamily:'Nunito,sans-serif', fontSize:13, fontWeight:700, cursor:'pointer'
                    }}>
                    {val ? '🟢 Visible on page' : '⚫ Hidden from page'}
                  </button>
                ))}
              </div>
            </div>

            <div className="ad-form-field">
              <label className="ad-form-label">📝 Reviews (up to 3)</label>
              <div style={{display:'flex', flexDirection:'column', gap:12}}>
                {(() => {
                  try {
                    const reviews = JSON.parse(form.reviews_json || '[]')
                    return (
                      <>
                        {[0,1,2].map(i => {
                          const review = reviews[i] || { text: '', author: '' }
                          return (
                            <div key={i} style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:12}}>
                              <div style={{fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.35)', marginBottom:8, textTransform:'uppercase'}}>Review #{i+1}</div>
                              <input className="ad-form-input" placeholder='Review text (e.g., "Amazing keepsake")'
                                value={review.text} onChange={e => {
                                  const r = [...reviews]
                                  if (!r[i]) r[i] = {}
                                  r[i].text = e.target.value
                                  setForm(p => ({...p, reviews_json: JSON.stringify(r)}))
                                }} style={{marginBottom:8}} />
                              <input className="ad-form-input" placeholder='Author name (e.g., "Sarah M.")'
                                value={review.author} onChange={e => {
                                  const r = [...reviews]
                                  if (!r[i]) r[i] = {}
                                  r[i].author = e.target.value
                                  setForm(p => ({...p, reviews_json: JSON.stringify(r)}))
                                }} />
                            </div>
                          )
                        })}
                      </>
                    )
                  } catch { return <div style={{color:'#ff8080'}}>Invalid reviews JSON</div> }
                })()}
              </div>
            </div>

            <button className="ad-submit-btn" disabled={saving} onClick={handleSave}>
              {saving ? '⏳ Saving...' : '✅ Save Story Page'}
            </button>
            <button className="ad-story-btn"
              style={{width:'100%', marginTop:12, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)'}}
              onClick={() => window.open(`/story/${selected.id}`, '_blank')}>
              👁️ Open Story Detail Preview
            </button>
            <button className="ad-modal-close"
              style={{marginTop:8, background:'rgba(255,255,255,0.06)', boxShadow:'none'}}
              onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// ── MAIN ADMIN ──
export default function Admin() {
  const [tab, setTab] = useState('orders')

  return (
    <>
      <style>{css}</style>
      <div className="ad-root">
        <div className="ad-topbar">
          <div className="ad-logo">✨ StoryKid Admin</div>
          <div className="ad-topbar-right">
            <div className="ad-live-dot" />
            <span className="ad-live-text">Dashboard</span>
          </div>
        </div>

        <div className="ad-tabs">
          <button className={`ad-tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
            📦 Orders
          </button>
          <button className={`ad-tab ${tab === 'stories' ? 'active' : ''}`} onClick={() => setTab('stories')}>
            📚 Stories
          </button>
          <button className={`ad-tab ${tab === 'pages' ? 'active' : ''}`} onClick={() => setTab('pages')}>
            🧩 Story Pages
          </button>
        </div>

        {tab === 'orders' ? <OrdersTab /> : tab === 'stories' ? <StoriesTab /> : <StoryPageTab />}
      </div>
    </>
  )
}