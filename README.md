# Skillify LMS

By Hrishabh3829

A modern, full‑stack Learning Management System built with the MERN stack. It lets creators build and publish courses with videos, and enables students to search, purchase, and learn with tracked progress.

## Highlights
- Fast React + Vite frontend with Tailwind + shadcn/ui components
- Smooth, accessible UI with Motion animations and dark mode via next-themes
- Secure Node/Express backend with MongoDB and JWT auth
- Media uploads to Cloudinary with Multer; H.264/VP9 transcodes for broad playback
- Payments via Stripe (server dependency present)
- Robust progress tracking per lecture and auto‑advance on completion

## Tech Stack
- Frontend: React 18, Vite 7, Redux Toolkit/RTK Query, React Router, Tailwind CSS 4, shadcn/ui (Radix UI), lucide-react, motion, next-themes, sonner
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, Multer, Cloudinary, Stripe

## Features
- Authentication & Profile
  - Register, login, logout with JWT auth
  - Protected routes and persisted session
  - Profile view/update with avatar upload

- Roles & Access Control
  - Student and Instructor roles
  - Instructor‑only admin area guarded by route checks
  - Purchase‑protected routes to access paid content

- Catalog & Discovery
  - Browse published courses
  - Search with query, category filters, and price sort
  - Course detail header with key info and skeleton loaders

- Course Management (Instructor)
  - Create/edit courses with thumbnail upload and publish toggle
  - Add/edit/remove lectures per course
  - Cloudinary video uploads via Multer

- Purchases & Billing
  - Stripe Checkout session creation
  - Webhook handling for purchase confirmation
  - “My Learning” shows enrolled courses

- Learning Experience
  - Course Progress page with native video player
  - Mark lecture complete on video end (no duplicate toasts)
  - Accurate progress bar (unique completed lectures)
  - Auto‑advance to next lecture and sticky sidebar

- Dashboards & Analytics
  - Instructor dashboard with total sales and revenue
  - Price chart for purchased courses (Recharts)

- UX & Performance
  - Responsive layout, dark mode, and accessible components (shadcn/ui)
  - Motion animations, skeletons, and toasts for smooth feedback
  - Vite dev server and RTK Query caching for fast loads

## Project Structure
- client/ — React app (Vite)
  - src/components/ui — shadcn/ui wrappers (avatar, button, dialog, select, etc.)
  - src/features/api — RTK Query API slices (auth, course, purchase, progress)
  - src/pages — Views (student, admin)
- server/ — Express API
  - routes/ — REST endpoints (user, course, purchase, media, progress)
  - controller/ — business logic
  - models/ — Mongoose models
  - utils/ — Cloudinary, multer, auth helpers

## Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- Cloudinary account (CLOUDINARY_URL or credentials)
- Stripe secret (if enabling payments)

## Quick Start
1) Install deps
- In two terminals (client and server folders):
  - client: `npm install`
  - server: `npm install`

2) Configure env (server/.env)
- PORT=5000
- MONGODB_URI=mongodb://localhost:27017/skillify
- JWT_SECRET=your_jwt_secret
- CLOUDINARY_CLOUD_NAME=...
- CLOUDINARY_API_KEY=...
- CLOUDINARY_API_SECRET=...
- STRIPE_SECRET=sk_test_...

3) Run dev
- server: `npm run dev` (http://localhost:5000)
- client: `npm run dev` (http://localhost:5173)

## Notes
- The client uses next-themes to avoid theme flash; UI tokens map to Tailwind variables.
- Videos are served via native <video> with Cloudinary transforms for mp4/webm/auto.
- Error boundaries are recommended for production routes.

## Scripts
- client
  - dev, build, preview, lint
- server
  - dev (nodemon)

## Troubleshooting
- Cloudinary playback: ensure https URLs; transforms applied: `f_mp4,vc_h264` | `f_webm,vc_vp9`.
- Vite optimize cache: if you see “Outdated Optimize Dep”, stop dev, delete node_modules/.vite and restart.
- CORS: confirm client origin in server cors() matches the running port (default 5173).

## License
MIT

## Author
Hrishabh3829
