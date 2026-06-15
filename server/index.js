import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import multer from 'multer'
import { Resend } from 'resend'
import swaggerUi from 'swagger-ui-express'

dotenv.config()

const app = express()
const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.RESEND_KEY || ''
if (!RESEND_API_KEY) console.warn('⚠️ RESEND_API_KEY is not set. Email sending will fail.')
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) console.warn('⚠️ SUPABASE_URL or SUPABASE_KEY is missing. Supabase database/storage will fail.')
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  : null

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 } // 200MB max
})

const localOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  'https://localhost:5173',
  'https://127.0.0.1:5173'
]
const extraOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '')
  .split(',')
  .map(value => value.trim())
  .filter(Boolean)
const allowedOrigins = new Set([...localOrigins, ...extraOrigins])

const isAllowedOrigin = (origin) => {
  if (!origin) return true
  if (allowedOrigins.has(origin)) return true
  return /^(https?:\/\/)(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)
    || /(?:^|\.)vercel\.app$/i.test(origin)
    || /(?:^|\.)render\.com$/i.test(origin)
    || /(?:^|\.)netlify\.app$/i.test(origin)
}

app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) return callback(null, true)
    callback(new Error('Not allowed by CORS'))
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
  preflightContinue: false
}))
app.options('*', cors())

app.use(express.json({ limit: '200mb' }))
app.use(express.urlencoded({ extended: true, limit: '200mb' }))

// Simple request logger to help debug routing
app.use((req, res, next) => {
  console.log('➡️', req.method, req.path)
  next()
})

function requireSupabase(res) {
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Supabase not configured. Set SUPABASE_URL and SUPABASE_KEY.' })
    return false
  }
  return true
}

function removeUnknownStoryColumn(updates, error) {
  const message = error?.message || ''
  const match = message.match(/Could not find the '([^']+)' column of 'stories'/)
  if (!match) return null
  const unknownColumn = match[1]
  if (!(unknownColumn in updates)) return null
  const { [unknownColumn]: _, ...filtered } = updates
  return filtered
}

async function safeStoryInsert(updates) {
  let payload = { ...updates }
  if (!Object.keys(payload).length) {
    return { data: null, error: new Error('No valid fields to insert') }
  }
  while (true) {
    const { data, error } = await supabase.from('stories').insert([payload]).select()
    if (!error) return { data, error: null }
    const filtered = removeUnknownStoryColumn(payload, error)
    if (!filtered || Object.keys(filtered).length === Object.keys(payload).length) {
      return { data: null, error }
    }
    console.warn('⚠️ Removing unknown story column and retrying insert:', Object.keys(payload).filter(k => !(k in filtered)))
    payload = filtered
  }
}

async function safeStoryUpdate(id, updates) {
  let payload = { ...updates }
  if (!Object.keys(payload).length) {
    return { data: null, error: new Error('No valid fields to update') }
  }
  while (true) {
    const { data, error } = await supabase.from('stories').update(payload).eq('id', id).select()
    if (!error) return { data, error: null }
    const filtered = removeUnknownStoryColumn(payload, error)
    if (!filtered || Object.keys(filtered).length === Object.keys(payload).length) {
      return { data: null, error }
    }
    console.warn('⚠️ Removing unknown story column and retrying update:', Object.keys(payload).filter(k => !(k in filtered)))
    payload = filtered
  }
}

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'StoryKid API',
    version: '1.0.0',
    description: 'Express API for StoryKid backend routes',
  },
  servers: [
    { url: 'http://localhost:3001', description: 'Local server' }
  ],
  paths: {
    '/': {
      get: {
        summary: 'Health check',
        responses: {
          '200': { description: 'API is running' }
        }
      }
    },
    '/stories': {
      get: {
        summary: 'List all stories',
        responses: {
          '200': { description: 'Stories list returned' }
        }
      },
      post: {
        summary: 'Create a new story',
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  subtitle: { type: 'string' },
                  language: { type: 'string' },
                  published: { type: 'boolean' },
                  price: { type: 'number' },
                  age_range: { type: 'string' },
                  page_count: { type: 'number' },
                  binding: { type: 'string' },
                  format: { type: 'string' },
                  type: { type: 'string' },
                  description: { type: 'string' },
                  long_description: { type: 'string' },
                  cover: { type: 'string', format: 'binary' },
                  pdf: { type: 'string', format: 'binary' },
                  gallery: { type: 'string', format: 'binary' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Story created' }
        }
      }
    },
    '/stories/{id}': {
      get: {
        summary: 'Get story by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Story returned' }
        }
      },
      patch: {
        summary: 'Update story by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Story updated' }
        }
      },
      delete: {
        summary: 'Delete story by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Story deleted' }
        }
      }
    },
    '/submit-order': {
      post: {
        summary: 'Submit a story order',
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  childName: { type: 'string' },
                  age: { type: 'string' },
                  language: { type: 'string' },
                  interests: { type: 'string' },
                  characters: { type: 'string' },
                  selectedValues: { type: 'string' },
                  specialRequest: { type: 'string' },
                  parentEmail: { type: 'string' },
                  photo: { type: 'string', format: 'binary' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Order submitted' }
        }
      }
    },
    '/proxy-pdf': {
      get: {
        summary: 'Proxy a PDF URL for CORS-safe viewing',
        parameters: [{ name: 'url', in: 'query', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'PDF proxy ready' }
        }
      }
    }
  }
}

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// ── MULTER ERROR HANDLER ──
// Placeholder for multer errors, actual handler is attached further below.

// ── EMAIL FUNCTION ──
async function sendEmails(order) {
  const { childName, parentEmail, language, interests, characters, selectedValues, specialRequest } = order

  if (!resend) {
    const reason = 'RESEND_API_KEY is not set. Emails cannot be sent.'
    console.warn('⚠️', reason)
    return { success: false, reason }
  }

  try {
    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail) {
      console.warn('⚠️ ADMIN_EMAIL is not set. Admin notification email will be skipped.')
    } else {
      await resend.emails.send({
        from: 'StoryKid <onboarding@resend.dev>',
        to: adminEmail,
        subject: `🆕 New Order — ${childName}'s Story`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#1a0533;color:white;padding:32px;border-radius:16px;">
            <h1 style="color:#a855f7;margin-bottom:24px;">✨ New StoryKid Order!</h1>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:10px 0;color:rgba(255,255,255,0.5);width:140px;">👶 Child</td><td style="padding:10px 0;font-weight:700;">${childName}</td></tr>
              <tr><td style="padding:10px 0;color:rgba(255,255,255,0.5);">🌍 Language</td><td style="padding:10px 0;">${language}</td></tr>
              <tr><td style="padding:10px 0;color:rgba(255,255,255,0.5);">🦁 Interests</td><td style="padding:10px 0;">${interests}</td></tr>
              <tr><td style="padding:10px 0;color:rgba(255,255,255,0.5);">⭐ Heroes</td><td style="padding:10px 0;">${characters || '—'}</td></tr>
              <tr><td style="padding:10px 0;color:rgba(255,255,255,0.5);">💎 Values</td><td style="padding:10px 0;">${Array.isArray(selectedValues) ? selectedValues.join(', ') : selectedValues}</td></tr>
              <tr><td style="padding:10px 0;color:rgba(255,255,255,0.5);">📧 Email</td><td style="padding:10px 0;color:#a5b4fc;">${parentEmail}</td></tr>
              ${specialRequest ? `<tr><td style="padding:10px 0;color:rgba(255,255,255,0.5);">💬 Request</td><td style="padding:10px 0;font-style:italic;">"${specialRequest}"</td></tr>` : ''}
            </table>
            <div style="margin-top:24px;padding:16px;background:rgba(168,85,247,0.15);border-radius:12px;border:1px solid rgba(168,85,247,0.3);">
              <a href="http://localhost:5173/admin" style="color:#a855f7;font-weight:700;">→ Open Admin Dashboard</a>
            </div>
          </div>
        `
      })
    }

    await resend.emails.send({
      from: 'StoryKid <onboarding@resend.dev>',
      to: parentEmail,
      subject: `✨ We received ${childName}'s story order!`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:linear-gradient(135deg,#1a0533,#2d1b69);padding:40px 32px;border-radius:16px 16px 0 0;text-align:center;">
            <div style="font-size:48px;margin-bottom:12px;">📖</div>
            <h1 style="color:white;font-size:28px;margin:0;">Your order is confirmed!</h1>
            <p style="color:rgba(255,255,255,0.6);margin-top:8px;">We're preparing ${childName}'s magical story</p>
          </div>
          <div style="background:#f9f5ff;padding:32px;border-radius:0 0 16px 16px;">
            <h2 style="color:#1a0533;margin-bottom:20px;">Order Summary</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:10px 0;color:#6b7280;border-bottom:1px solid #e5e7eb;">👶 Child's name</td><td style="padding:10px 0;font-weight:700;color:#1a0533;border-bottom:1px solid #e5e7eb;">${childName}</td></tr>
              <tr><td style="padding:10px 0;color:#6b7280;border-bottom:1px solid #e5e7eb;">🌍 Story language</td><td style="padding:10px 0;color:#1a0533;border-bottom:1px solid #e5e7eb;">${language}</td></tr>
              <tr><td style="padding:10px 0;color:#6b7280;border-bottom:1px solid #e5e7eb;">💎 Values</td><td style="padding:10px 0;color:#1a0533;border-bottom:1px solid #e5e7eb;">${Array.isArray(selectedValues) ? selectedValues.join(', ') : selectedValues}</td></tr>
            </table>
            <div style="margin-top:28px;background:linear-gradient(135deg,#a855f7,#6366f1);padding:20px;border-radius:12px;text-align:center;">
              <p style="color:white;margin:0;font-size:15px;">📬 We'll contact you at <strong>${parentEmail}</strong> when your story is ready!</p>
            </div>
            <p style="color:#9ca3af;font-size:13px;margin-top:24px;text-align:center;">
              Thank you for choosing StoryKid ✨<br/>
              Questions? Reply to this email anytime.
            </p>
          </div>
        </div>
      `
    })

    console.log('📧 Emails sent successfully!')
    return { success: true }
  } catch (err) {
    console.error('❌ Email error:', err)
    return { success: false, reason: err.message || String(err) }
  }
}

// ── ROUTES ──

app.get('/', (req, res) => {
  res.json({ message: 'StoryKid API is running ✅' })
})

app.post('/submit-order', upload.single('photo'), async (req, res) => {
  console.log("=== INCOMING FROM REACT ===", req.body)

  const { childName, age, language, interests, characters, selectedValues, specialRequest, parentEmail } = req.body

  if (!childName || !age || !language || !parentEmail) {
    console.log("❌ REJECTED: Missing required fields")
    return res.status(400).json({ success: false, error: 'Missing required fields' })
  }

  if (!requireSupabase(res)) return

  try {
    let photoUrl = null

    if (req.file) {
      console.log("📸 Photo caught! Uploading to bucket...")
      const fileName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`

      const { error: uploadError } = await supabase.storage
        .from('order-photos')
        .upload(fileName, req.file.buffer, { contentType: req.file.mimetype })

      if (uploadError) {
        console.error('❌ Storage upload error:', uploadError)
        throw new Error('Failed to upload image')
      }

      const { data: publicUrlData } = supabase.storage
        .from('order-photos')
        .getPublicUrl(fileName)

      photoUrl = publicUrlData.publicUrl
      console.log("✅ Photo uploaded:", photoUrl)
    }

    let parsedValues = []
    try { parsedValues = JSON.parse(selectedValues) } catch { parsedValues = [] }

    console.log("💾 Saving to Supabase...")

    const { data, error } = await supabase
      .from('Orders')
      .insert([{
        child_name: childName,
        age: parseInt(age),
        language,
        interests,
        characters: characters || '',
        values: parsedValues.join(', '),
        special_request: specialRequest || '',
        parent_email: parentEmail,
        status: 'new',
        photo_url: photoUrl
      }])
      .select()

    console.log("=== SUPABASE ERROR ===", error)
    console.log("=== SUPABASE DATA ===", data)

    if (error) {
      console.error('❌ Supabase error:', error)
      return res.status(500).json({ success: false, error: 'Database error' })
    }

    console.log("🎉 Order saved! ID:", data[0].id)

    // Send emails and report any email configuration issues
    const emailResult = await sendEmails({
      childName, parentEmail, language,
      interests, characters,
      selectedValues: parsedValues,
      specialRequest
    })

    const responsePayload = { success: true, orderId: data[0].id }
    if (!emailResult.success) {
      responsePayload.emailWarning = emailResult.reason || 'Email sending failed'
    }

    res.json(responsePayload)

  } catch (err) {
    console.error('❌ Server error:', err)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

app.get('/orders', async (req, res) => {
  if (!requireSupabase(res)) return

  try {
    const { data, error } = await supabase
      .from('Orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error("❌ GET /orders error:", error)
      return res.status(500).json({ success: false, error: 'Database error' })
    }

    res.json({ success: true, orders: data })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

app.patch('/orders/:id/status', async (req, res) => {
  if (!requireSupabase(res)) return
  const { id } = req.params
  const { status } = req.body
  try {
    const { error } = await supabase
      .from('Orders')
      .update({ status })
      .eq('id', id)

    if (error) return res.status(500).json({ success: false, error: 'Update failed' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

// ── STORIES ──

app.get('/stories', async (req, res) => {
  console.log('🔍 Handler: GET /stories')
  if (!requireSupabase(res)) return

  try {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) return res.status(500).json({ success: false, error })
    res.json({ success: true, stories: data })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

// Get single story by id
app.get('/stories/:id', async (req, res) => {
  if (!requireSupabase(res)) return
  const { id } = req.params
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('id', id)
      .limit(1)

    if (error) return res.status(500).json({ success: false, error })
    if (!data || data.length === 0) return res.status(404).json({ success: false, error: 'Not found' })
    res.json({ success: true, story: data[0] })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

app.post('/stories', upload.fields([{ name: 'cover' }, { name: 'pdf' }, { name: 'gallery' }]), async (req, res) => {
  if (!requireSupabase(res)) return

  try {
    const { title, subtitle, language, published, price, age_range, page_count, binding, format, type, description, long_description } = req.body
    console.log('✨ Creating new story:', { title, subtitle, language, published, price, age_range, page_count, binding, format, type })
    console.log('📁 Files:', req.files ? Object.keys(req.files) : 'none')

    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' })
    }

    const updates = {
      title: title || '',
      subtitle: subtitle || '',
      language: language || 'English',
      published: published !== 'false' && published !== false
    }

    if (price !== undefined && price !== null && price !== '') {
      const parsedPrice = Number(price)
      if (!Number.isNaN(parsedPrice)) updates.price = parsedPrice
    }
    if (age_range !== undefined) updates.age_range = age_range
    if (page_count !== undefined && page_count !== '') {
      const parsedPageCount = parseInt(page_count, 10)
      if (!Number.isNaN(parsedPageCount)) updates.page_count = parsedPageCount
    }
    if (binding !== undefined) updates.binding = binding
    if (format !== undefined) updates.format = format
    if (type !== undefined) updates.type = type
    if (description !== undefined) updates.description = description
    if (long_description !== undefined) updates.long_description = long_description

    if (req.files?.cover?.[0]) {
      try {
        const file = req.files.cover[0]
        const fileName = `covers/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`
        const { error: uploadError } = await supabase.storage
          .from('stories')
          .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: true })
        if (uploadError) {
          console.error('❌ Cover upload error:', uploadError)
        } else {
          const { data } = supabase.storage.from('stories').getPublicUrl(fileName)
          updates.cover_url = data.publicUrl
          console.log('✅ Cover uploaded:', updates.cover_url)
        }
      } catch (e) {
        console.error('❌ Cover processing error:', e)
      }
    }

    if (req.files?.pdf?.[0]) {
      try {
        const file = req.files.pdf[0]
        const fileName = `pdfs/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`
        const { error: uploadError } = await supabase.storage
          .from('stories')
          .upload(fileName, file.buffer, { contentType: 'application/pdf', upsert: true })
        if (uploadError) {
          console.error('❌ PDF upload error:', uploadError)
        } else {
          const { data } = supabase.storage.from('stories').getPublicUrl(fileName)
          updates.pdf_url = data.publicUrl
          console.log('✅ PDF uploaded:', updates.pdf_url)
        }
      } catch (e) {
        console.error('❌ PDF processing error:', e)
      }
    }

    // handle gallery images (multiple)
    const galleryUrls = []
    if (req.files?.gallery && Array.isArray(req.files.gallery) && req.files.gallery.length) {
      for (let i = 0; i < req.files.gallery.length; i++) {
        try {
          const file = req.files.gallery[i]
          const fileName = `gallery/${Date.now()}-${i}-${file.originalname.replace(/\s+/g, '-')}`
          const { error: uploadError } = await supabase.storage
            .from('stories')
            .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: true })
          if (uploadError) {
            console.error('❌ Gallery upload error:', uploadError)
          } else {
            const { data } = supabase.storage.from('stories').getPublicUrl(fileName)
            galleryUrls.push(data.publicUrl)
          }
        } catch (e) {
          console.error('❌ Gallery file error:', e)
        }
      }
      if (galleryUrls.length) updates.gallery_urls = JSON.stringify(galleryUrls)
    }

    const { data, error } = await safeStoryInsert(updates)

    if (error) {
      console.error('❌ DB insert error:', error)
      return res.status(500).json({ success: false, error: error.message || JSON.stringify(error) || 'Database error' })
    }
    if (!data || data.length === 0) {
      console.error('❌ No data returned from insert')
      return res.status(500).json({ success: false, error: 'Failed to create story' })
    }
    console.log('🎉 Story created:', data[0])
    res.json({ success: true, story: data[0] })
  } catch (err) {
    console.error('❌ POST /stories error:', err)
    res.status(500).json({ success: false, error: err.message || 'Server error' })
  }
})

app.patch('/stories/:id', upload.fields([{ name: 'cover' }, { name: 'pdf' }, { name: 'gallery' }]), async (req, res) => {
  if (!requireSupabase(res)) return

  try {
    const { id } = req.params
    const { title, subtitle, language, published, price, age_range, page_count, binding, format, type, description, long_description, reviews_json } = req.body
    console.log('✏️ Updating story:', id, req.body)
    console.log('📁 Files:', req.files)

    const updates = {
      title,
      subtitle,
      language,
      published: published === 'true'
    }

    if (price !== undefined && price !== null && price !== '') {
      const parsedPrice = Number(price)
      if (!Number.isNaN(parsedPrice)) updates.price = parsedPrice
    }
    if (age_range !== undefined) updates.age_range = age_range
    if (page_count !== undefined && page_count !== '') {
      const parsedPageCount = parseInt(page_count, 10)
      if (!Number.isNaN(parsedPageCount)) updates.page_count = parsedPageCount
    }
    if (binding !== undefined) updates.binding = binding
    if (format !== undefined) updates.format = format
    if (type !== undefined) updates.type = type
    if (description !== undefined) updates.description = description
    if (long_description !== undefined) updates.long_description = long_description
    if (reviews_json !== undefined) updates.reviews_json = reviews_json

    if (req.files?.cover?.[0]) {
      const file = req.files.cover[0]
      const fileName = `covers/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`
      const { error: uploadError } = await supabase.storage
        .from('stories')
        .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: true })
      if (uploadError) {
        console.error('❌ Cover upload error:', uploadError)
      } else {
        const { data } = supabase.storage.from('stories').getPublicUrl(fileName)
        updates.cover_url = data.publicUrl
        console.log('✅ Cover uploaded:', updates.cover_url)
      }
    }

    if (req.files?.pdf?.[0]) {
      const file = req.files.pdf[0]
      const fileName = `pdfs/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`
      const { error: uploadError } = await supabase.storage
        .from('stories')
        .upload(fileName, file.buffer, { contentType: 'application/pdf', upsert: true })
      if (uploadError) {
        console.error('❌ PDF upload error:', uploadError)
      } else {
        const { data } = supabase.storage.from('stories').getPublicUrl(fileName)
        updates.pdf_url = data.publicUrl
        console.log('✅ PDF uploaded:', updates.pdf_url)
      }
    }

    // handle gallery uploads (append to existing gallery_urls if present)
    const newGallery = []
    if (req.files?.gallery && Array.isArray(req.files.gallery) && req.files.gallery.length) {
      for (let i = 0; i < req.files.gallery.length; i++) {
        try {
          const file = req.files.gallery[i]
          const fileName = `gallery/${Date.now()}-${i}-${file.originalname.replace(/\s+/g, '-')}`
          const { error: uploadError } = await supabase.storage
            .from('stories')
            .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: true })
          if (uploadError) {
            console.error('❌ Gallery upload error:', uploadError)
          } else {
            const { data } = supabase.storage.from('stories').getPublicUrl(fileName)
            newGallery.push(data.publicUrl)
          }
        } catch (e) {
          console.error('❌ Gallery file error:', e)
        }
      }
    }

    // merge with existing gallery_urls if present
    if (newGallery.length) {
      try {
        const existing = await supabase.from('stories').select('gallery_urls').eq('id', id).limit(1)
        let existingArr = []
        if (existing && existing.data && existing.data[0] && existing.data[0].gallery_urls) {
          try { existingArr = JSON.parse(existing.data[0].gallery_urls) } catch { existingArr = [] }
        }
        updates.gallery_urls = JSON.stringify([...(existingArr || []), ...newGallery])
      } catch (e) {
        updates.gallery_urls = JSON.stringify(newGallery)
      }
    }

    const { data, error } = await safeStoryUpdate(id, updates)

    if (error) {
      console.error('❌ DB update error:', error)
      return res.status(500).json({ success: false, error: error.message || JSON.stringify(error) || 'Database error' })
    }

    console.log('🎉 Story updated:', data[0])
    res.json({ success: true, story: data[0] })
  } catch (err) {
    console.error('❌ Server error:', err)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

app.delete('/stories/:id', async (req, res) => {
  if (!requireSupabase(res)) return
  const { id } = req.params
  try {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('❌ Delete story error:', error)
      return res.status(500).json({ success: false, error: 'Failed to delete story' })
    }

    res.json({ success: true })
  } catch (err) {
    console.error('❌ Server error:', err)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

// ── CORS BYPASS PROXY FOR APP PDFs ──
app.get('/proxy-pdf', async (req, res) => {
  const { url } = req.query
  if (!url) return res.status(400).json({ success: false, error: 'Missing URL parameter' })

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch file from storage')
    
    const arrayBuffer = await response.arrayBuffer()
    
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Access-Control-Allow-Origin', '*') 
    res.send(Buffer.from(arrayBuffer))
  } catch (err) {
    console.error('❌ PDF Proxy Error:', err)
    res.status(500).send('Error loading PDF file')
  }
})

// ── SERVE FRONTEND (if built) ──
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const clientDist = path.join(__dirname, '../client/dist')

if (fs.existsSync(path.join(clientDist, 'index.html'))) {
  app.use(express.static(clientDist))
  // register API routes before this in the file so static fallback doesn't override them
  app.get('*', (req, res, next) => {
    // Avoid serving the SPA for API routes — let API handlers respond first
    const apiPrefixes = ['/stories', '/orders', '/submit-order', '/proxy-pdf']
    if (apiPrefixes.some(p => req.path === p || req.path.startsWith(p + '/'))) return next()
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

// ── START SERVER ──
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3001
let serverPort = DEFAULT_PORT
let server = app.listen(serverPort, () => console.log(`🚀 Server running on port ${serverPort}`))

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const fallbackPort = serverPort + 1
    console.warn(`⚠️ Port ${serverPort} is already in use. Trying port ${fallbackPort}...`)
    server = app.listen(fallbackPort, () => {
      serverPort = fallbackPort
      console.log(`🚀 Server running on port ${serverPort}`)
    })
    server.on('error', (fallbackErr) => {
      console.error('❌ Failed to start server on fallback port:', fallbackErr)
      process.exit(1)
    })
    return
  }
  console.error('❌ Server failed to start:', err)
  process.exit(1)
})

// ── MULTER ERROR HANDLER ──
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ success: false, error: 'File too large. Maximum size is 200MB.' })
    }
    return res.status(400).json({ success: false, error: err.message })
  }
  next(err)
})

// ── ERROR HANDLER ──
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err)
  res.status(500).json({ success: false, error: err.message || 'Server error' })
})