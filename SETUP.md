# LifeLine AI - Complete Setup Guide

## 🎯 Quick Start (5 minutes)

### Option 1: Windows Batch File (Easiest)
1. Double-click `start.bat` in the project root
2. Two command windows will open automatically
3. Wait for both servers to start
4. Open browser to `http://localhost:3000`

### Option 2: Manual Setup

#### Step 1: Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

#### Step 2: Start Backend Server
```bash
cd backend
npm start
```
You should see: `Server running on port 5000`

#### Step 3: Start Frontend (in new terminal)
```bash
cd frontend
npm run dev
```
You should see: `VITE v8.0.16  ready in 123 ms`

#### Step 4: Open Browser
Navigate to: `http://localhost:3000`

### Option 3: Docker (No Local Setup Required)
```bash
docker-compose up
```
Then open: `http://localhost:3000`

---

## 📝 Login & Demo

### Guest Access (Recommended for Testing)
1. Click "Continue as Guest" on login page
2. Enjoy full dashboard access immediately

### Test Credentials
- **Email:** any@email.com
- **Password:** any password

### Test Features

#### 1. Emergency SOS
- Click the red "Emergency Help" banner on dashboard
- Simulates ambulance dispatch and emergency contact notification

#### 2. Health Vitals
- Go to "Vitals" section
- Enter sample vital signs:
  - Heart Rate: 72 bpm
  - Blood Pressure: 120/80
  - Temperature: 98.6°F
  - Oxygen Level: 98%
- View vitals history and trends

#### 3. Find Hospitals
- Navigate to "Hospitals" section
- View pre-loaded sample hospitals
- Check bed availability and specialties
- Mock call and directions functionality

#### 4. Health Dashboard
- View real-time health metrics
- Track recent vital signs
- Access quick services
- Monitor upcoming appointments

---

## 🗂️ Project Structure

```
lifeline-healthcare/
├── backend/
│   ├── server.js          # Main Express server
│   ├── package.json       # Backend dependencies
│   ├── .env               # Environment variables
│   └── Dockerfile         # Docker configuration
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx        # Main React component
│   │   ├── api.ts         # API service layer
│   │   ├── types.ts       # TypeScript types
│   │   ├── index.css      # Global styles
│   │   └── main.tsx       # Entry point
│   ├── index.html         # HTML template
│   ├── vite.config.ts     # Vite configuration
│   ├── tailwind.config.js # Tailwind CSS config
│   ├── package.json       # Frontend dependencies
│   └── Dockerfile         # Docker configuration
│
├── docker-compose.yml     # Docker Compose setup
├── start.bat              # Windows startup script
├── start.sh               # Unix startup script
├── README.md              # Main documentation
├── SETUP.md               # This file
└── .gitignore             # Git ignore rules
```

---

## 🔧 Configuration

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lifeline-healthcare
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

### Frontend (vite.config.ts)
API proxy is configured to forward `/api` requests to `http://localhost:5000`

---

## 📊 Database Setup

### MongoDB Local
If you have MongoDB installed locally:
```bash
# Start MongoDB service
mongod
```

### MongoDB with Docker
```bash
docker run -d -p 27017:27017 --name lifeline-mongo mongo
```

### Check Connection
The backend will automatically:
1. Connect to MongoDB if available
2. Use in-memory storage if MongoDB is not available
3. Seed sample hospital data on first run

---

## 🧪 API Testing

### Test API Endpoints

#### Login as Guest
```bash
curl -X POST http://localhost:5000/api/auth/guest
```

#### Get Hospitals
```bash
curl http://localhost:5000/api/hospitals
```

#### Add Vital Signs
```bash
curl -X POST http://localhost:5000/api/vitals \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "heartRate": 72,
    "bloodPressure": "120/80",
    "temperature": 98.6,
    "oxygenLevel": 98
  }'
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using port 5000 (Backend)
netstat -ano | findstr :5000

# Check what's using port 3000 (Frontend)
netstat -ano | findstr :3000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in `.env`
- Backend will work with mock data if MongoDB unavailable

### Frontend Won't Connect to Backend
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify vite.config.ts proxy settings

### Package Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

---

## 📱 Responsive Testing

### Desktop (1920x1080)
- Full sidebar navigation
- Complete dashboard with all cards
- All features visible

### Tablet (768x1024)
- Responsive grid layout
- Optimized spacing and sizing
- Bottom navigation visible

### Mobile (375x812)
- Hamburger menu
- Single column layout
- Touch-friendly buttons
- Full functionality preserved

Test responsiveness:
1. Open DevTools (F12)
2. Click device toolbar icon
3. Select device or custom size

---

## 🚀 Building for Production

### Frontend
```bash
cd frontend
npm run build
# Output: dist/ folder with optimized build
```

### Backend
```bash
cd backend
npm start
# Or use production process manager like PM2
```

### Docker Production Build
```bash
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d
```

---

## 📋 Features Checklist

- ✅ Modern, clean healthcare UI
- ✅ Real-time health metrics dashboard
- ✅ Emergency SOS button with alerts
- ✅ Hospital finder with bed availability
- ✅ Vital signs tracking and history
- ✅ Appointment management
- ✅ Patient medical records
- ✅ User profile management
- ✅ Responsive mobile design
- ✅ Dark theme with blue accents
- ✅ Full backend API integration
- ✅ Guest access option
- ✅ Secure authentication ready
- ✅ Docker deployment ready

---

## 🔐 Security Notes

### Development
- Authentication is simplified for demo purposes
- Use strong passwords in production
- Enable HTTPS on production servers

### Production
- Set `NODE_ENV=production`
- Use strong JWT_SECRET
- Enable rate limiting
- Set up CORS properly
- Use environment variables for sensitive data
- Enable database authentication
- Use HTTPS/TLS

---

## 📞 Support

### Common Issues & Solutions

**Issue:** "Cannot find module"
- Solution: Run `npm install` in the directory

**Issue:** "Port already in use"
- Solution: Kill the process or change port in .env

**Issue:** "MongoDB connection refused"
- Solution: Start MongoDB or use Docker MongoDB

**Issue:** "CORS error in console"
- Solution: Check backend is running on port 5000

---

## 🎓 Learning Resources

- React: https://react.dev
- TypeScript: https://www.typescriptlang.org
- Tailwind CSS: https://tailwindcss.com
- Express: https://expressjs.com
- MongoDB: https://docs.mongodb.com

---

## 📝 Next Steps

1. ✅ Get the dashboard running
2. Test all features (vitals, hospitals, SOS, etc.)
3. Customize styling in `tailwind.config.js`
4. Add real database connectivity
5. Implement advanced features (notifications, real-time updates)
6. Deploy to production

---

**LifeLine AI** - Making Healthcare Accessible
