const { Router } = require('express');

const authRoutes = require('./auth.routes');
const usersRoutes = require('./users.routes');
const patientsRoutes = require('./patients.routes');
const vitalsRoutes = require('./vitals.routes');
const hospitalsRoutes = require('./hospitals.routes');
const appointmentsRoutes = require('./appointments.routes');
const dashboardRoutes = require('./dashboard.routes');

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/patients', patientsRoutes);
router.use('/vitals', vitalsRoutes);
router.use('/hospitals', hospitalsRoutes);
router.use('/appointments', appointmentsRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
