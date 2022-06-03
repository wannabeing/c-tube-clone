const localsMiddleware = (req, res, next) => {
  // Session INFO -> locals INFO
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.user = req.session.user || {};

  res.locals.siteName = "C-Tube";
  next();
};
// Need Session INFO
const redirectLogin = (req, res, next) => {
  if (req.session.user) {
    return next();
  } else {
    return res.redirect("/login");
  }
};
// Not Needed Session INFO
const redirectHome = (req, res, next) => {
  if (!req.session.user) {
    return next();
  } else {
    return res.redirect("/");
  }
};

export { localsMiddleware, redirectLogin, redirectHome };
