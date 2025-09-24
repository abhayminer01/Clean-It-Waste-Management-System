const router = require('express').Router();
const industryController = require('../controllers/industry.controller');
const { industryAuthMiddleware } = require('../middlewares/auth.middleware');

router.post('/register', industryController.registerIndustry);
router.get('/checkauth', industryController.checkAuth);
router.post('/login', industryController.loginIndustry);
router.get('/check-status', industryAuthMiddleware, industryController.checkStatus);

module.exports = router;