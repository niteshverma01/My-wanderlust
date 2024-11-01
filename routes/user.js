const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveresdirectUrl } = require("../middlewear.js");

const usercontroller = require("../controllers/user.js");

router
  .route("/signup")
  .get(usercontroller.renderSignup)
  .post(wrapAsync(usercontroller.signUp));

router
  .route("/login")
  .get(usercontroller.renderLogin)
  .post(
    saveresdirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    usercontroller.login
  );

router.get("/logout", usercontroller.logout);

module.exports = router;
