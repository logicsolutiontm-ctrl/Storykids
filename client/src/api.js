// Centralized API base URL for frontend.
// If VITE_API_BASE is not set, use same-origin requests so Vite proxy can handle API routing in local/ngrok dev.
const envApiBase = (import.meta.env.VITE_API_BASE || '').trim()
const isNgrokHost =
	typeof window !== 'undefined' &&
	/(?:^|\.)ngrok-free\.(?:app|dev)$/i.test(window.location.hostname)

export const API_BASE = isNgrokHost ? '' : envApiBase