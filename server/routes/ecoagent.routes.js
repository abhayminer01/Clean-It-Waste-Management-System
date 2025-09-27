const router = require('express').Router();
const ecoagentController = require('../controllers/ecoagent.controller');

router.post('/login', ecoagentController.agentLogin);


module.exports = router;