const { Router } = require('express');
const { create, getByUserId } = require('../controllers/vitals.controller');
const { requireAuth, requireOwnUser } = require('../middleware/auth.middleware');

const router = Router();

router.post('/', requireAuth, create);
router.get('/:userId', requireAuth, requireOwnUser('userId'), getByUserId);

module.exports = router;
