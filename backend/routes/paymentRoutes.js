const express = require("express");

const router = express.Router();

const verifyJWT = require("../middleware/verifyJWT");

const {
   createCheckoutSession,
} = require("../controllers/paymentController");


// STRIPE CHECKOUT
router.post(
   "/checkout/:id",
   verifyJWT,
   createCheckoutSession
);

module.exports = router;