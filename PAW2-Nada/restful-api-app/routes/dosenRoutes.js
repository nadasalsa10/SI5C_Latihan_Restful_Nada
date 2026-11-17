const express = require('express');
const router = express.Router();
const dosenController = require('../controllers/dosenController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', dosenController.getAll);
router.get('/:id', dosenController.getById);
router.post('/', verifyToken, dosenController.create);

module.exports = router;