# StoryKid Backend — setup

## Environment variables
Create a `.env` file in the `server/` folder with these values (do NOT commit secrets):

```
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_KEY=<your-supabase-service-role-or-anon-key>
RESEND_API_KEY=<your-resend-api-key>
COMPANY_EMAIL=info@storykids.fun
ADMIN_EMAIL=info@storykids.fun
ORDER_NOTIFICATION_EMAIL=info@storykids.fun
EMAIL_FROM=StoryKid <info@storykids.fun>
REPLY_TO_EMAIL=info@storykids.fun
GMAIL_USER=yourgmail@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
```

Where to find them:
- SUPABASE_URL and keys: Supabase dashboard → Project → Settings → API. Use the `service_role` key for full backend access, or `anon` for limited public access.
- RESEND_API_KEY: Resend dashboard — used for sending emails.
- COMPANY_EMAIL: the main business inbox used as the default sender identity and reply destination.
- ORDER_NOTIFICATION_EMAIL: the inbox that receives new order requests. Defaults to `ADMIN_EMAIL`, then `COMPANY_EMAIL`.
- EMAIL_FROM: a sender address from a verified domain in Resend. For this project, set it to `StoryKid <info@storykids.fun>`.
- REPLY_TO_EMAIL: the customer-facing reply-to address. For this project, set it to `info@storykids.fun`.
- GMAIL_USER and GMAIL_APP_PASSWORD: optional alternative to Resend for sending from a personal Gmail account.

If you do not use a domain email, set:
- `GMAIL_USER`
- `GMAIL_APP_PASSWORD` (create this in Google Account → Security → App Passwords)

When Resend is configured, the server uses it first for both admin and customer emails. Gmail SMTP is only a fallback.

## Run locally
1. Install deps and start backend (in `server/`):

```powershell
cd server
npm install
npm run dev
```

2. Start frontend (in `client/`):

```powershell
cd ../client
npm install
npm run dev
```

The frontend expects `VITE_API_BASE` in `client/.env` (example: `VITE_API_BASE=http://localhost:3001`).

## Deploy
- On Render (or similar), create environment variables matching the names above.
- Set `CORS_ORIGIN` to your frontend URL, for example `https://your-app.vercel.app`.
- Set `FRONTEND_URL` too if you want the same value used in the app.
- Do NOT commit the `.env` file. Use the platform's secret manager to set `SUPABASE_URL`, `SUPABASE_KEY`, and `RESEND_API_KEY`.

## Useful notes
- The backend warns if `SUPABASE_URL` or `SUPABASE_KEY` are missing; check server logs for early errors.
- If you need me to add CI, Dockerfile, or deployment config, tell me which provider and I can add it.
