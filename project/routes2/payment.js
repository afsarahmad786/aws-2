const path = require("path");

const express = require("express");
const userAuthenticate = require("../middleware/auth");

const paymentcontroller = require("../controllers/payment");

const router = express.Router();

// router.post("/order", userAuthenticate.authenticate, paymentcontroller.add);

router.get(
  "/buypremium",
  userAuthenticate.authenticate,
  paymentcontroller.buypremimusss
);
router.post(
  "/updateordertransaction",
  userAuthenticate.authenticate,
  paymentcontroller.updateTransaction
);

module.exports = router;
