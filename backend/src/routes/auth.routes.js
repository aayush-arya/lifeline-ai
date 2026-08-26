const { Router } = require('express');
const { register, login, loginAsGuest } = require('../controllers/auth.controller');

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/guest', loginAsGuest);

module.exports = router;
