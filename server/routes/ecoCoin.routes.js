const express = require("express");
const router = express.Router();
const ecoCoinController = require("../controllers/ecoCoin.controller");
const { userAuthMiddleware } = require("../middlewares/auth.middleware");

// Get total coins + history for logged-in user
router.get("/", userAuthMiddleware, ecoCoinController.getEcoCoins);

module.exports = router;
