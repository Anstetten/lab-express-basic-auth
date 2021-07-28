const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");

router.get("/users/profile", requireAuth, function (req, res, next) {
  res.render("users/users.hbs");
});

module.exports = router;
