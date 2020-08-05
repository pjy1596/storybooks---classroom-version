const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    req.flash("success_msg", "successfully logged in");
    res.redirect("/dashboard");
  }
);
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});
module.exports = router;
