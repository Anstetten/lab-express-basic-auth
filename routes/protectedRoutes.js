const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");

router.get("/main", requireAuth, function (req, res, next) {
    res.render("protected/main.hbs");
  });

  router.get("/private", requireAuth, function (req, res, next) {
    res.render("protected/private.hbs");
  });

  module.exports = router;