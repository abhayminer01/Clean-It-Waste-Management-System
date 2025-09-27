const router = require('express').Router();
const ecoagentController = require('../controllers/ecoagent.controller');
const { ecoagentAuthMiddleware } = require('../middlewares/auth.middleware');

router.post('/login', ecoagentController.agentLogin);
router.get('/pickups/new', ecoagentAuthMiddleware, ecoagentController.getNewPickupsForAgent);
router.patch('/pickups/:id/accept', ecoagentAuthMiddleware, ecoagentController.acceptPickup);
router.get('/pickups/accepted', ecoagentAuthMiddleware, ecoagentController.getAcceptedPickups);
router.patch('/pickups/:id/picked', ecoagentAuthMiddleware, ecoagentController.markPickupAsPicked);

module.exports = router;