const router = require('express').Router();
const pickupController = require('../controllers/pickup.controller');
const { userAuthMiddleware } = require('../middlewares/auth.middleware');

router.post('/create', userAuthMiddleware, pickupController.createPickup);
router.get("/", userAuthMiddleware, pickupController.getUserPickups);
router.delete("/:id", userAuthMiddleware, pickupController.deletePickup);
router.put("/:id", userAuthMiddleware, pickupController.updatePickup);

module.exports = router;