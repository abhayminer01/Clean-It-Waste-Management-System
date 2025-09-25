const router = require('express').Router();
const adminController = require('../controllers/admin.controller');

router.post('/login', adminController.adminLogin);

// INDUSTRY
router.get('/new-industry', adminController.getNewIndustry);
router.put("/industry/:id/verify", adminController.verifyIndustry);
router.put("/industry/:id/reject", adminController.rejectIndustry);
router.get('/industry', adminController.getIndustries);

// PICKUPS
router.get("/pickups", adminController.getAllPickups);
router.delete("/pickups/:id", adminController.deletePickup);

// USERS
router.get("/users", adminController.getAllUsers);
router.delete("/users/:id", adminController.deleteUser);

module.exports = router;