// Centralized API base URL for frontend. 
// Uses the Render environment variable if available, otherwise falls back directly to your live production server.
export const API_BASE = import.meta.env.VITE_API_BASE || 'https://storykids-server-last.onrender.com';