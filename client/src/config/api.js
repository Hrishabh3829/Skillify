// Central API base resolution for both local dev and production
// Set VITE_API_BASE_URL in Vercel env to your backend URL (e.g. https://skillify-api.yourdomain.com)
// Fallback: localhost during dev, placeholder for production until backend deployed.
const FALLBACK_PROD = 'https://your-backend-domain.com'; // TODO: replace after backend deploy
export const API_BASE = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : FALLBACK_PROD);

export const apiPath = (segment = '') => `${API_BASE}${segment.startsWith('/') ? segment : '/' + segment}`;
