const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { userAuthMiddleware } = require("../middlewares/auth.middleware");

router.get("/profile", userAuthMiddleware, userController.getProfile);
router.put("/profile", userAuthMiddleware, userController.updateProfile);
router.put("/change-password", userAuthMiddleware, userController.changePassword);
router.post("/logout", userAuthMiddleware, userController.logoutUser);

module.exports = router;
