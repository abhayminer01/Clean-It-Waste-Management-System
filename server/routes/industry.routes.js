const router = require('express').Router();
const industryController = require('../controllers/industry.controller');
const pickupController = require('../controllers/pickup.controller');
const { industryAuthMiddleware } = require('../middlewares/auth.middleware');

router.post('/register', industryController.registerIndustry);
router.get('/checkauth', industryController.checkAuth);
router.post('/login', industryController.loginIndustry);
router.get('/check-status', industryAuthMiddleware, industryController.checkStatus);

//pickups
router.get("/user/history", industryAuthMiddleware, pickupController.getIndustryUserPickups);
router.put("/:id", industryAuthMiddleware, pickupController.updateIndustryPickup);
router.delete("/:id", industryAuthMiddleware, pickupController.deleteIndustryPickup);


module.exports = router;