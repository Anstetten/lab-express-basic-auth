function isLoggedIn(req, res, next) {
    console.log(res.locals.isLoggedInn.isIt);
    if (res.locals.isLoggedIn.isIt ===true) {
      next();
    } else {
      res.redirect("/signin");
    }
  }
  
  module.exports = isLoggedIn;