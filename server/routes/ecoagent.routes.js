const router = require('express').Router();
const ecoagentController = require('../controllers/ecoagent.controller');
const { ecoagentAuthMiddleware } = require('../middlewares/auth.middleware');

router.post("/login", ecoagentController.agentLogin);

// Split into two routes
router.get("/pickups/new/household", ecoagentAuthMiddleware, ecoagentController.getNewHouseholdPickups);
router.get("/pickups/new/industrial", ecoagentAuthMiddleware, ecoagentController.getNewIndustrialPickups);

router.patch("/pickups/:id/accept", ecoagentAuthMiddleware, ecoagentController.acceptPickup);
router.get("/pickups/accepted", ecoagentAuthMiddleware, ecoagentController.getAcceptedPickups);
router.patch("/pickups/:id/picked", ecoagentAuthMiddleware, ecoagentController.markPickupAsPicked);


module.exports = router;