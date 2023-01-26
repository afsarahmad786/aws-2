const path = require("path");

const express = require("express");

const usercontroller = require("../controllers/user");

const router = express.Router();

router.post("/user/register", usercontroller.register);
router.post("/login", usercontroller.login);
router.post("/password/forgotpassword", usercontroller.restorepass);
router.get("/password/forgotpassword/:uuid", usercontroller.resetpass);
router.post("/password/reset/:uuid", usercontroller.changepass);

module.exports = router;
