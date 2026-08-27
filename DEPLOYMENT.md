# Deployment

The backend and frontend deploy independently. This guide uses Render (backend) and Vercel (frontend), both of which have a free tier and deploy straight from a GitHub repo - but any Node host works for the backend, and any static host works for the frontend build.

## Backend (Render)

1. On [render.com](https://render.com), create a **New Web Service** from this repository.
2. Set **Root Directory** to `backend`, **Build Command** to `npm install`, **Start Command** to `npm start`.
3. Add environment variables:
   | Key | Value |
   |---|---|
   | `JWT_SECRET` | a long random string - generate one with `openssl rand -hex 32` |
   | `GOOGLE_MAPS_API_KEY` | optional, enables real nearby-hospital search |
   | `MONGODB_URI` | optional, enables real persistence - a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster's connection string. Without it, data resets whenever the free-tier service spins down. |
4. Deploy, then copy the resulting URL (e.g. `https://lifeline-ai-backend.onrender.com`).

Render's free tier sleeps after 15 minutes of inactivity - the first request after a sleep takes a few seconds to wake it back up.

## Frontend (Vercel)

1. On [vercel.com](https://vercel.com), import this repository.
2. Set **Root Directory** to `frontend` (Vercel auto-detects the Vite build/output settings from `frontend/vercel.json`).
3. Add one environment variable: `VITE_API_URL` = `<your Render backend URL>/api`.
4. Deploy.

## Verifying the deployment

```bash
curl https://<your-backend-url>/api/health
```

Then open the frontend URL, sign in with the seeded demo account (`demo@lifeline.ai` / `demo1234`) or continue as a guest, and confirm the Hospitals page loads data - that exercises the full frontend → backend round trip.

## Docker

```bash
JWT_SECRET=$(openssl rand -hex 32) docker-compose up
```

Builds and runs both services locally via their Dockerfiles. Useful for a production-like smoke test before deploying, or as a starting point for deploying to any container host (Fly.io, a VPS, ECS, etc.).
