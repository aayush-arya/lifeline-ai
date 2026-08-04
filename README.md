# LifeLine AI - Healthcare Dashboard

A modern, professional healthcare management dashboard built with React, Node.js, and MongoDB. Features real-time health monitoring, emergency services, hospital finder, and comprehensive patient management.

## 🚀 Features

- **Smart Dashboard** - Real-time health metrics and quick access to essential services
- **Vital Signs Tracking** - Record and monitor heart rate, blood pressure, temperature, and oxygen levels
- **Hospital Finder** - Locate nearby hospitals with real-time bed availability and specialties
- **Emergency Services** - One-tap SOS alert with automatic emergency contact notification
- **Medical Records** - Centralized patient medical history and document management
- **Appointment Management** - Schedule and track medical appointments
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Authentication** - Secure login with guest access option

## 🛠️ Tech Stack

### Frontend
- React 19 with TypeScript
- Tailwind CSS for modern styling
- Vite for fast development and building
- Axios for API communication
- Lucide React for beautiful icons

### Backend
- Node.js with Express
- MongoDB for data persistence
- JWT for authentication
- CORS enabled for cross-origin requests

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (or Docker for containerized setup)

## 🚀 Quick Start

### Option 1: Local Development

#### 1. Setup Backend
```bash
cd backend
npm install
npm start
```
Backend will run on `http://localhost:5000`

#### 2. Setup Frontend (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:3000`

### Option 2: Docker Compose (Recommended)

```bash
docker-compose up
```

This will start:
- Frontend on `http://localhost:3000`
- Backend on `http://localhost:5000`
- MongoDB on `localhost:27017`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/guest` - Login as guest

### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Create new patient
- `GET /api/patients/:id` - Get patient by ID

### Vitals
- `POST /api/vitals` - Record vital signs
- `GET /api/vitals/:userId` - Get user's vital history

### Hospitals
- `GET /api/hospitals` - Get all hospitals
- `POST /api/hospitals` - Add new hospital

### Appointments
- `POST /api/appointments` - Schedule appointment
- `GET /api/appointments/:userId` - Get user's appointments

### Dashboard
- `GET /api/dashboard/:userId` - Get dashboard data

## 🎨 UI Features

### Modern Design
- Dark theme with blue accent colors matching healthcare branding
- Glass morphism effects for depth
- Smooth animations and transitions
- Mobile-first responsive layout

### Components
- **Dashboard** - Overview of health metrics and quick actions
- **Hospitals** - Hospital directory with ratings and availability
- **Vitals** - Health tracking and history
- **Appointments** - Appointment scheduling and management
- **Profile** - User settings and information
- **Medical Records** - Document management

## 🔐 Security Features

- Input validation on both frontend and backend
- Environment variables for sensitive data
- CORS protection
- User authentication with JWT tokens
- Password hashing with bcryptjs

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎯 Demo Credentials

For testing purposes, you can use any email and password combination when logging in locally. Guest access is also available.

## 🧪 Testing Features

1. **Emergency SOS** - Click the red SOS button on any page
2. **Add Vitals** - Record health metrics and view history
3. **Hospital Search** - Browse nearby hospitals with full details
4. **Appointment Booking** - Schedule and manage appointments
5. **User Profile** - View and update user information

## 🚀 Deployment

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
npm start
```

### Docker Deployment

```bash
docker-compose -f docker-compose.yml up -d
```

## 📊 Database Schema

### Users Collection
- name, email, phone, password
- userType (patient, doctor, admin, guest)
- profilePicture, address, dateOfBirth, bloodType
- emergencyContact details

### Patients Collection
- userId, name, age, gender
- medicalHistory, allergies, medications
- lastCheckup, nextAppointment

### Vitals Collection
- userId, heartRate, bloodPressure, temperature
- oxygenLevel, weight, height, bloodGlucose
- recordedAt timestamp

### Hospitals Collection
- name, address, phone, email
- specialties, emergencyAvailable, rating
- beds, availableBeds

### Appointments Collection
- patientId, doctorId, hospitalId
- appointmentDate, reason, status, notes

## 🐛 Troubleshooting

### Backend Connection Issues
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env` file
- Verify port 5000 is not in use

### Frontend Not Loading
- Clear browser cache
- Check if backend is running
- Verify Vite dev server is running on port 3000

### API Errors
- Check browser console for CORS errors
- Verify API endpoints are correct
- Ensure backend server is responding

## 📚 Documentation

For more detailed information about specific features:
- Check component files in `frontend/src/`
- Review API routes in `backend/server.js`
- Examine database schemas in `backend/server.js`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions, please create an issue in the repository.

## 🎉 Acknowledgments

- Built with ❤️ for healthcare professionals
- Inspired by modern healthcare management systems
- Designed for accessibility and ease of use

---

**LifeLine AI** - Making Healthcare Accessible, Efficient, and Secure
