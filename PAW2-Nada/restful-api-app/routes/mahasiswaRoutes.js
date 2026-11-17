const express = require('express');
const router = express.Router();
const c = require('../controllers/mahasiswaController');
const verifyToken = require('../middlewares/verifyToken');
const hanyaRole = require('../middlewares/hanyaRole');

// Publik
router.get('/', c.getAll);
router.get('/:id', c.getById);

// user dan admin
router.post('/', verifyToken, hanyaRole('user', 'admin'), c.create);
router.put('/:id', verifyToken, hanyaRole('user', 'admin'), c.update);

// admin saja
router.delete('/:id', verifyToken, hanyaRole('admin'), c.remove);

module.exports = router;