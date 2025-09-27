// routes/rating.routes.js
const router = require("express").Router();
const { userAuthMiddleware } = require("../middlewares/auth.middleware");
const { submitRating } = require("../controllers/rating.controller");

router.post("/:id", userAuthMiddleware, submitRating);

module.exports = router;
