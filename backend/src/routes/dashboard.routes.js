const { Router } = require('express');
const { getDashboard } = require('../controllers/dashboard.controller');
const { requireAuth, requireOwnUser } = require('../middleware/auth.middleware');

const router = Router();

router.get('/:userId', requireAuth, requireOwnUser('userId'), getDashboard);

module.exports = router;
