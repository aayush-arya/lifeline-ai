const { Router } = require('express');
const { getAll, create, getById } = require('../controllers/patients.controller');

const router = Router();

router.get('/', getAll);
router.post('/', create);
router.get('/:id', getById);

module.exports = router;
