// routes/rating.routes.js
const express = require('express');
const router = express.Router();
const { submitRating } = require('../controllers/rating.controller');

router.post('/:pickupId', submitRating);

module.exports = router;
