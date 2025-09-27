const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const {userAuthMiddleware, industryAuthMiddleware} = require("../middlewares/auth.middleware");

router.post("/create-intent", userAuthMiddleware, paymentController.createPaymentIntent);
router.get("/user", userAuthMiddleware, paymentController.getUserPayments);
router.get("/:id", userAuthMiddleware, paymentController.getPaymentById);
router.post('/invoice', industryAuthMiddleware, paymentController.generateInvoiceData)

module.exports = router;

