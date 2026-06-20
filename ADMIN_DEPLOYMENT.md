# Admin Dashboard Deployment Guide

## ✅ What's Been Done

Your admin dashboard now has:

1. **Secure Login Page** - Password-protected authentication
   - Login component at `/admin` route
   - Password stored securely in environment variables
   - 24-hour session persistence

2. **Admin Dashboard** - Full-featured management panel with:
   - 📦 Orders tab - View and manage customer orders
   - 📚 Stories tab - Upload and manage story content
   - 🧩 Story Pages tab - Edit story details and pricing

3. **Git Commits** - Changes pushed to GitHub
   - Ready for Vercel deployment

---

## 🚀 Deploy to Vercel

### Step 1: Go to Vercel Dashboard
Visit https://vercel.com/dashboard

### Step 2: Import Your Project
- Click "Add New..." → "Project"
- Import from GitHub: `logicsolutiontm-ctrl/Storykids`
- Select the project and click "Import"

### Step 3: Set Environment Variables
In the Project Settings → Environment Variables, add:

**Name:** `VITE_ADMIN_PASSWORD`
**Value:** `storykid2024` (or your desired password)
**Add to:** Production, Preview, Development

⚠️ **IMPORTANT:** Change the default password to something secure!

### Step 4: Deploy
Click "Deploy" and Vercel will automatically:
- Build your React app
- Deploy to a live URL
- Enable automatic deployments on git push

---

## 🚀 Deploy on Render (Always-On Setup)

If you are using Render, deploy both services:

1. **Backend Web Service**
- Service type: `Web Service`
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Plan: **Starter or higher** (free web services can sleep)

2. **Frontend Static Site**
- Service type: `Static Site`
- Root directory: `client`
- Build command: `npm install && npm run build`
- Publish directory: `dist`

3. **Environment variables**

Backend (`server`):
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `RESEND_API_KEY`
- `ADMIN_EMAIL`
- `FRONTEND_URL` = your frontend Render URL (for example `https://storykid-client.onrender.com`)
- `CORS_ORIGIN` = same frontend URL

Frontend (`client`):
- `VITE_API_BASE` = your backend Render URL (for example `https://storykid-api.onrender.com`)
- `VITE_ADMIN_PASSWORD` = your strong admin password

4. **Optional: Blueprint file**
- This repo now includes `render.yaml` at the project root.
- In Render dashboard, create from Blueprint to provision both services quickly.

---

## 🔐 Changing Your Admin Password

### Locally:
Edit `client/.env.local`:
```
VITE_ADMIN_PASSWORD=your-secure-password-here
```

### On Vercel:
1. Go to Project Settings
2. Find Environment Variables
3. Update `VITE_ADMIN_PASSWORD`
4. Redeploy

---

## 📍 Access Your Admin Dashboard

Once deployed:
- Main site: `https://storykids.fun`
- Admin dashboard: `https://storykids.fun/admin`
- Enter password: `storykid2024` (or your custom password)

---

## 🧪 Test Locally

Your dev server is running at: `http://localhost:5173/admin`

Password: `storykid2024`

---

## ⚠️ Security Notes

- The password is stored in environment variables (not hardcoded)
- Sessions last 24 hours, then you need to log in again
- Consider using a more complex password in production
- Only you know the admin URL and password
