// Centralized API base URL for frontend. Set VITE_API_BASE in your .env for dev.
export const API_BASE = import.meta.env.VITE_API_BASE || (typeof window !== 'undefined' ? window.location.origin : '')
