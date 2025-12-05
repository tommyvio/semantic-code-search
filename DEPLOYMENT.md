# Deployment Guide

## Prerequisites
- GitHub account
- Railway account (free tier available)
- Vercel account (free tier available)

## Backend Deployment (Railway)

### Step 1: Prepare Repository
Ensure your repository is pushed to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Click "New Project" -> "Deploy from GitHub repo"
3. Select your `semantic-code-search` repo
4. Railway will automatically detect the Dockerfile in `backend/` if you point to it, or you might need to configure the root.
   - **Tip:** You may need to set the "Root Directory" to `backend` in Railway settings if it doesn't auto-detect.

5. **Configure Environment Variables:**
   Add these in Railway "Variables" tab:
   ```env
   CHROMA_DB_PATH=/app/chroma_db
   CORS_ORIGINS=https://your-frontend-url.vercel.app
   ```
   *(Note: You'll get the frontend URL in the next section. For now, you can use `*` or update it later)*

6. **Add Volume (Persistence):**
   - Go to Settings -> Volumes
   - Add a volume mounted at `/app/chroma_db`
   - This ensures your search index survives restarts.

7. **Deploy:**
   - Wait for the build to finish.
   - Copy the "Public URL" (e.g., `https://backend-production.up.railway.app`)

## Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import `semantic-code-search` from GitHub
4. **Build Configuration:**
   - Framework: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Environment Variables:**
   - Add `VITE_API_URL`
   - Value: `https://your-railway-backend.up.railway.app` (The URL from previous step)

6. **Deploy:**
   - Click "Deploy"
   - Wait for completion.
   - You will get a domain like `semantic-code-search.vercel.app`.

### Step 2: Final Link
- Go back to Railway and update `CORS_ORIGINS` with your actual Vercel domain to secure the API.

## Troubleshooting

### CORS Errors
- **Symptom:** Frontend says "Network Error" or console shows CORS issues.
- **Fix:** Ensure `CORS_ORIGINS` in Railway matches your Vercel URL exactly (no trailing slash).

### Search returns no results
- **Cause:** You haven't indexed anything yet.
- **Fix:** Use the API to index a repo first.
  ```bash
  curl -X POST https://your-backend.app/api/index \
    -d '{"repo_path": "https://github.com/expressjs/express"}'
  ```

### Build Failures
- **Frontend:** Check local build with `npm run build`.
- **Backend:** Check Railway logs. Ensure requirements.txt is present.
