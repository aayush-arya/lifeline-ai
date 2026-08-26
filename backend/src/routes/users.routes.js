const { Router } = require('express');
const { update } = require('../controllers/users.controller');
const { requireAuth, requireOwnUser } = require('../middleware/auth.middleware');

const router = Router();

router.put('/:id', requireAuth, requireOwnUser('id'), update);

module.exports = router;
