# Project Jeremy

Landing page built with Next.js + separate Express backend for API/business logic.

## Folder structure

- `app`, `components`, `public`: frontend (Next.js)
- `backend`: API server (Express + TypeScript)

## Frontend setup

1. Create `.env.local` from `.env.example`
2. Install dependencies and run:

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Backend setup

1. Go to backend folder
2. Create `.env` from `backend/.env.example`
3. Install dependencies and run:

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:4000`.

## API endpoints

- `GET /api/v1/health`
- `GET /api/v1/auth/status` (placeholder module for upcoming login/auth flow)
- `POST /api/v1/leads`

Request body for leads:

```json
{
  "email": "user@example.com",
  "name": "AI Enthusiast"
}
```

## Notes

- EmailJS credentials are now used on backend only.
- Frontend lead form submits to `NEXT_PUBLIC_API_URL/api/v1/leads`.
