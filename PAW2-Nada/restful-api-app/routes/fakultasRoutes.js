const express = require('express');
const router = express.Router();
const fakultasController = require('../controllers/fakultasController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', fakultasController.getAll);
router.get('/:id', fakultasController.getById);
router.post('/', verifyToken, fakultasController.create);

module.exports = router;