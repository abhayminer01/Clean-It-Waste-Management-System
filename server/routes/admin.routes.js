const router = require('express').Router();
const adminController = require('../controllers/admin.controller');

router.post('/login', adminController.adminLogin);
router.get('/new-industry', adminController.getNewIndustry);
router.put("/industry/:id/verify", adminController.verifyIndustry);
router.put("/industry/:id/reject", adminController.rejectIndustry);

module.exports = router;