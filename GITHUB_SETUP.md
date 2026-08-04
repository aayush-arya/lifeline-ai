# 🚀 Deploy LifeLine AI to GitHub

Complete guide to push your healthcare dashboard to GitHub and deploy it live.

---

## **Step 1: Create GitHub Repository**

1. Go to **https://github.com/new**
2. Create a new repository:
   - **Repository name:** `lifeline-ai` (or your preferred name)
   - **Description:** Healthcare dashboard with real-time monitoring
   - **Public** (recommended for portfolio) or **Private**
   - **Don't initialize** with README (we already have one)
   - Click **Create repository**

3. Copy the repository URL (it will look like):
   ```
   https://github.com/YOUR_USERNAME/lifeline-ai.git
   ```

---

## **Step 2: Push to GitHub**

Open terminal in the project directory and run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/lifeline-ai.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## **Step 3: Deploy Frontend to Vercel**

### **Option A: Automatic (Recommended)**

1. Go to **https://vercel.com**
2. Sign up with GitHub
3. Click **Import Project**
4. Select your **lifeline-ai** repository
5. **Framework:** Vite
6. **Root Directory:** `frontend`
7. **Build Command:** `npm run build`
8. **Output Directory:** `dist`
9. **Add environment variable:**
   - `VITE_API_URL` = `https://your-backend-url.com/api` (we'll set this after backend)
10. Click **Deploy**

Vercel gives you a live URL instantly! 🎉

### **Option B: Manual with CLI**

```bash
npm install -g vercel
vercel login
cd frontend
vercel
```

---

## **Step 4: Deploy Backend to Railway or Render**

### **Option A: Render (Easiest)**

1. Go to **https://render.com**
2. Sign up with GitHub
3. Click **New +** → **Web Service**
4. Select your GitHub repo
5. Configure:
   - **Name:** `lifeline-ai-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
   - **Plan:** Free
6. Click **Deploy**

Get your backend URL like: `https://lifeline-ai-backend.onrender.com`

### **Option B: Railway**

```bash
npm install -g @railway/cli
railway login
cd backend
railway up
```

---

## **Step 5: Connect Frontend to Backend**

1. Go back to **Vercel project settings**
2. **Environment Variables**
3. Update `VITE_API_URL`:
   ```
   https://lifeline-ai-backend.onrender.com/api
   ```
4. Redeploy

---

## **Step 6: Share Your App!**

Your app is now live! Share these URLs:

- **Frontend:** `https://your-app.vercel.app`
- **Backend API:** `https://your-backend.onrender.com`

---

## **Project Structure**

```
lifeline-ai/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── App.tsx    # Main dashboard component
│   │   ├── api.ts     # API service
│   │   └── types.ts   # TypeScript types
│   └── package.json
│
├── backend/           # Node.js + Express
│   ├── server.js      # Express server
│   └── package.json
│
├── README.md          # Project documentation
├── SETUP.md           # Local setup guide
├── DEPLOYMENT.md      # Detailed deployment guide
└── docker-compose.yml # Docker setup
```

---

## **Features Deployed**

✅ **Professional Healthcare Dashboard**
- Real-time health metrics
- Emergency SOS system
- Hospital finder with bed availability
- Vital signs tracking
- Appointment management
- Modern UI with purple-blue gradients

✅ **Full-Stack Ready**
- React frontend with TypeScript
- Node.js REST API
- Mock data (ready for real database)
- Docker support
- Fully responsive design

---

## **Troubleshooting**

### **Frontend not updating**
```bash
cd frontend
npm install
npm run build
```

### **Backend connection issues**
- Check `VITE_API_URL` in Vercel environment variables
- Ensure backend is running
- Check CORS is enabled (it is by default)

### **Port conflicts locally**
```bash
# Kill process on port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

---

## **Next Steps**

1. ✅ Repository created on GitHub
2. ✅ Frontend deployed on Vercel
3. ✅ Backend deployed on Railway/Render
4. ✅ App is live!

### **To Add Features:**
- Add real database (MongoDB Atlas, PostgreSQL)
- Add authentication (Firebase, Auth0)
- Add notifications (SendGrid, Twilio)
- Add payment processing (Stripe)
- Add analytics (Google Analytics, Mixpanel)

---

## **Support**

- **GitHub:** https://github.com
- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **Railway Docs:** https://railway.app/docs

---

## **Share Your Success! 🎉**

Once deployed, share your app on:
- LinkedIn (tag your network)
- GitHub (add a star ⭐)
- Twitter/X (show the healthcare community)
- Portfolio (impressive project!)

**LifeLine AI - Making Healthcare Accessible** 💙
