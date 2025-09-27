const router = require('express').Router();
const pickupController = require('../controllers/pickup.controller');
const { userAuthMiddleware, industryAuthMiddleware } = require('../middlewares/auth.middleware');

router.post('/create', userAuthMiddleware, pickupController.createPickup);
router.post('/create-industry', industryAuthMiddleware, pickupController.createIndustryPickup);
router.get("/", userAuthMiddleware, pickupController.getUserPickups);
router.delete("/:id", userAuthMiddleware, pickupController.deletePickup);
router.put("/:id", userAuthMiddleware, pickupController.updatePickup);
router.get("/:id", pickupController.getPickupById);

module.exports = router;