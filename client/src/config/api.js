// Central API base resolution for both local dev and production
// Set VITE_API_BASE_URL in Vercel env to your backend URL (e.g. https://skillify-api.yourdomain.com)
// Fallback: localhost during dev, placeholder for production until backend deployed.
// Deployed backend (Render) used as fallback when env var not provided and not on localhost
const FALLBACK_PROD = 'https://skillify-backend-bf3o.onrender.com';
const rawBase = (import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : FALLBACK_PROD) || '').trim();
// Remove any trailing slashes to prevent double '//' in requests (causes Express 5 404)
export const API_BASE = rawBase.replace(/\/+$/, '');

export const apiPath = (segment = '') => {
  const cleanSegment = segment.startsWith('/') ? segment : '/' + segment;
  return API_BASE + cleanSegment;
};
