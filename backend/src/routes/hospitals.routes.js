const { Router } = require('express');
const { getAll, getNearby, create } = require('../controllers/hospitals.controller');

const router = Router();

// Static path must be registered before any future '/:id' route so it
// isn't shadowed by a param match.
router.get('/nearby', getNearby);
router.get('/', getAll);
router.post('/', create);

module.exports = router;
