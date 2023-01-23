const path = require("path");

const express = require("express");
const userAuthenticate = require("../middleware/auth");
const expensecontroller = require("../controllers/expense");

const router = express.Router();

router.post("/expense", userAuthenticate.authenticate, expensecontroller.add);
router.get("/expense", userAuthenticate.authenticate, expensecontroller.list);
router.delete(
  "/expense/:id",
  userAuthenticate.authenticate,
  expensecontroller.deleteitem
);

router.get(
  "/leaderboard",
  userAuthenticate.authenticate,
  expensecontroller.leaderboards
);

router.get("/report", userAuthenticate.authenticate, expensecontroller.reports);
router.get(
  "/downloadreport",
  userAuthenticate.authenticate,
  expensecontroller.downloadExpense
);

router.get(
  "/seereport",
  userAuthenticate.authenticate,
  expensecontroller.SeeReports
);

module.exports = router;
