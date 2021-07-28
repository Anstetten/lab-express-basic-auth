const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/main", isLoggedIn, function (req, res, next) {
    res.render("protected/main.hbs");
  });

  router.get("/private", isLoggedIn, function (req, res, next) {
    res.render("protected/private.hbs");
  });

  module.exports = router;