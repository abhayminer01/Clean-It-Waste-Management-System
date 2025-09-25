const router = require('express').Router();
const pickupController = require('../controllers/pickup.controller');
const { userAuthMiddleware } = require('../middlewares/auth.middleware');

router.post('/create', userAuthMiddleware, pickupController.createPickup);

module.exports = router;