// routes/rating.routes.js
const router = require("express").Router();
const { ecoagentAuthMiddleware } = require("../middlewares/auth.middleware");
const { submitRating } = require("../controllers/rating.controller");

router.post("/:id", ecoagentAuthMiddleware, submitRating);

module.exports = router;
