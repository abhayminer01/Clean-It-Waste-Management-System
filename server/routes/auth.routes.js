const router = require('express').Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.registerUser);
router.post('/login', authController.userLogin);
router.get('/checkauth', authController.checkAuth);

module.exports = router;