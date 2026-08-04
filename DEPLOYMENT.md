# LifeLine AI - Cloud Deployment Guide

## 🚀 Deploy to Cloud (Free)

This guide shows how to deploy your healthcare dashboard to the cloud using **free services**.

---

## **Option 1: Deploy Backend to Render (Recommended)**

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended) or email
3. Click "New +" → Select "Web Service"

### Step 2: Connect GitHub
1. If using GitHub:
   - Push your code to GitHub: `git push`
   - Select your repository
   - Branch: `main`

2. If not using GitHub:
   - Copy backend folder contents
   - Create new repo on GitHub
   - Push to GitHub

### Step 3: Configure Backend Deploy
- **Name:** `lifeline-ai-backend`
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** Free

### Step 4: Set Environment Variables
In Render dashboard, add:
```
PORT=5000
NODE_ENV=production
```

### Step 5: Deploy
- Click "Deploy"
- Wait for build to complete (5-10 minutes)
- You'll get a URL like: `https://lifeline-ai-backend.onrender.com`
- Copy this URL (you'll need it for frontend)

**Note:** Free tier sleeps after 15 minutes of inactivity. First request may take 30 seconds.

---

## **Option 2: Deploy Frontend to Vercel**

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub (recommended)
3. Click "Add New..." → "Project"

### Step 2: Import Project
1. Select your GitHub repository
2. Select `frontend` folder as root directory
3. Click "Import"

### Step 3: Configure Build Settings
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 4: Set Environment Variables
Add in Vercel project settings:
```
VITE_API_URL=https://lifeline-ai-backend.onrender.com/api
```

(Replace with your actual Render backend URL)

### Step 5: Deploy
- Click "Deploy"
- Wait for build (2-3 minutes)
- Get URL: `https://lifeline-ai.vercel.app` (example)

---

## **Complete Deployment Steps**

### 1. Prepare Code for Cloud

```bash
# Initialize git (if not already)
cd lifeline-healthcare
git init

# Create .gitignore
cat > .gitignore << EOF
node_modules/
.env
.env.local
dist/
build/
.DS_Store
EOF

# Commit code
git add .
git commit -m "Initial commit: LifeLine AI Healthcare Dashboard"
```

### 2. Push to GitHub

```bash
# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/lifeline-healthcare.git
git branch -M main
git push -u origin main
```

### 3. Deploy Backend on Render

1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name:** lifeline-ai-backend
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** backend
   - **Environment:** Node
5. Add environment variables (see above)
6. Click "Deploy"
7. **Wait for deployment** - note the URL

### 4. Deploy Frontend on Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select your GitHub repo
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** frontend
   - **Build Command:** `npm run build`
   - **Output Directory:** dist
5. Add environment variable:
   - `VITE_API_URL` = your Render backend URL
6. Click "Deploy"
7. **Wait for deployment** - get the URL

---

## **Alternative: Deploy Both on Railway (Simpler)**

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up
3. Create new project

### Step 2: Deploy Backend
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Step 3: Deploy Frontend
```bash
cd frontend
railway up
```

Railway handles everything automatically!

---

## **Testing Cloud Deployment**

### 1. Test Backend API
```bash
curl https://your-backend-url.onrender.com/api/hospitals
```

Should return hospital data.

### 2. Test Frontend
Open `https://your-frontend-url.vercel.app` in browser

Should show login page → click "Continue as Guest" → see dashboard

### 3. Check API Connection
- Open DevTools (F12)
- Go to Network tab
- Perform actions (add vitals, view hospitals)
- Check API calls are hitting your backend URL

---

## **Environment Variables**

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lifeline
```

### Frontend (.env / Vercel)
```
VITE_API_URL=https://your-backend-url.com/api
```

---

## **Domain Setup (Optional)**

### Custom Domain on Vercel
1. Project Settings → Domains
2. Add custom domain
3. Update DNS records
4. Done!

### Custom Domain on Render
1. Settings → Custom Domain
2. Add domain
3. Follow DNS instructions

---

## **Monitoring & Logs**

### Render Logs
- Dashboard → select service → Logs tab
- View real-time logs

### Vercel Logs
- Deployments → select deployment → Logs
- View build and runtime logs

---

## **Troubleshooting**

### Build Fails
- Check build logs in dashboard
- Ensure `package.json` scripts are correct
- Verify all dependencies are listed

### API Not Connecting
- Check VITE_API_URL matches backend URL
- Add `/api` to end of URL
- Check CORS is enabled on backend

### Slow Performance
- Free tier services sleep after inactivity
- First request will be slow (~30s)
- Upgrade to paid plan for always-on

### Database Issues
- Free tier doesn't include MongoDB
- Use mock data (already in app)
- Or add MongoDB Atlas URL to backend

---

## **Cost Summary**

| Service | Cost | Notes |
|---------|------|-------|
| Vercel (Frontend) | Free | 100GB/month bandwidth |
| Render (Backend) | Free | Sleeps after 15min |
| Railway | Free | $5/month credit |
| MongoDB Atlas | Free | 512MB storage |

**Total: $0/month for full working app!**

---

## **Next Steps**

1. ✅ Test locally (http://localhost:3000)
2. ✅ Deploy backend (Render)
3. ✅ Deploy frontend (Vercel)
4. ✅ Update API URL in frontend
5. ✅ Test cloud version
6. ✅ Share URL with users!

---

## **Useful Links**

- **Render:** https://render.com
- **Vercel:** https://vercel.com
- **Railway:** https://railway.app
- **GitHub:** https://github.com

---

## **Support**

If deployment fails:
1. Check deployment logs
2. Verify environment variables
3. Check repository is public (for Render/Vercel)
4. Try different service (Railway)

---

**Your LifeLine AI is now production-ready! 🚀**
