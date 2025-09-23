const router = require('express').Router();
const industryController = require('../controllers/industry.controller');

router.post('/register', industryController.registerIndustry);

module.exports = router;