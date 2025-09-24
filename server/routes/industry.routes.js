const router = require('express').Router();
const industryController = require('../controllers/industry.controller');

router.post('/register', industryController.registerIndustry);
router.get('/checkauth', industryController.checkAuth);
router.get('/login', industryController.loginIndustry);

module.exports = router;