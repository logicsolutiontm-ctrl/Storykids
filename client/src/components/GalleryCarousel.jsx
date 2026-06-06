import { useState } from 'react'

export default function GalleryCarousel({ images, placeholder }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const safeIndex = Math.max(0, Math.min(currentIndex, images.length - 1))
  const currentImage = images && images[safeIndex] ? images[safeIndex] : placeholder

  if (!images || images.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <img src={placeholder} alt="cover" style={{ maxWidth: 520, maxHeight: '70vh', width: '100%', height: 'auto', objectFit: 'contain', borderRadius: 12 }} />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button 
          onClick={() => setCurrentIndex(i => Math.max(0, i - 1))} 
          style={{ position: 'absolute', left: -32, top: '50%', transform: 'translateY(-50%)' }} 
          aria-label="prev">
          ◀
        </button>
        <img 
          src={currentImage} 
          alt="cover" 
          style={{ maxWidth: 520, maxHeight: '70vh', width: '100%', height: 'auto', objectFit: 'contain', borderRadius: 12 }} 
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholder }} 
        />
        <button 
          onClick={() => setCurrentIndex(i => Math.min(images.length - 1, i + 1))} 
          style={{ position: 'absolute', right: -32, top: '50%', transform: 'translateY(-50%)' }} 
          aria-label="next">
          ▶
        </button>
      </div>
      
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 8, overflowX: 'auto', padding: 6 }}>
          {images.map((src, idx) => (
            <img 
              key={idx} 
              src={src || placeholder} 
              onClick={() => setCurrentIndex(idx)} 
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholder }} 
              style={{
                width: 72,
                height: 72,
                objectFit: 'cover',
                borderRadius: 8,
                cursor: 'pointer',
                borderWidth: idx === currentIndex ? 2 : 1,
                borderStyle: 'solid',
                borderColor: idx === currentIndex ? '#60a5fa' : 'rgba(255,255,255,0.06)'
              }} 
            />
          ))}
        </div>
      )}
    </div>
  )
}
