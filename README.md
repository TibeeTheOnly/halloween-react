# Halloween React (React + TypeScript + Vite)

This repository contains a small React + TypeScript app (Vite) used to track which houses have candy for Halloween.

The app is intentionally minimal and demonstrates:
- React + TypeScript with Vite
- Simple fetch-based API client (configured via env var)
- Small component structure (table + new address form)

Quick start
1. Install dependencies:

   npm install

2. Start dev server:

   npm run dev

3. Build for production:

   npm run build

Environment variables
- The app expects an environment variable named `VITE_API_BASE_URL` pointing to the backend API base URL (e.g. `http://localhost:3000/houses`).
  Create a `.env` file in the project root or export it in your shell. Example `.env`:

  VITE_API_BASE_URL=http://localhost:3000/houses

Project structure (important files)
- `src/api.ts` — small API helper and CRUD calls
- `src/types.ts` — shared TypeScript types
- `src/App.tsx` — main app component
- `src/components/HousesTable.tsx` — list & actions
- `src/components/NewAddress.tsx` — form to add a house

Localization
- This repo includes a Hungarian translation of the README: `README.hu.md`.

Contributing
- Improve docs, add tests, or introduce i18n if you want to support multiple languages in the UI.

License
- This project is private by default. Update `package.json`/LICENSE as needed.

If you'd like, I can also add a minimal i18n wiring (react-intl or react-i18next) so UI strings can be switched between English and Hungarian at runtime.
