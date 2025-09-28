const router = require("express").Router();
const pickupController = require("../controllers/pickup.controller");
const { industryAuthMiddleware, ecoagentAuthMiddleware } = require("../middlewares/auth.middleware");
const industryController = require('../controllers/industry.controller');

router.post("/register", industryController.registerIndustry);
router.post("/login", industryController.loginIndustry);
router.get("/checkauth", industryController.checkAuth);
router.get("/check-status", industryAuthMiddleware, industryController.checkStatus);

// profile
router.get("/profile", industryAuthMiddleware, industryController.getIndustryProfile);
router.put("/profile", industryAuthMiddleware, industryController.updateIndustryProfile);
router.get("/logout", industryAuthMiddleware, industryController.logoutIndustry);

// pickups
router.get("/user/history", industryAuthMiddleware, pickupController.getIndustryUserPickups);
router.put("/:id", industryAuthMiddleware, pickupController.updateIndustryPickup);
router.delete("/:id", industryAuthMiddleware, pickupController.deleteIndustryPickup);
router.get("/pickups", ecoagentAuthMiddleware, industryController.getAgentPickups);

module.exports = router;
