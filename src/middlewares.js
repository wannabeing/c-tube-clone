const localsMiddleware = (req, res, next) => {
  // Session INFO -> locals INFO
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.user = req.session.user;

  res.locals.siteName = "C-Tube";
  next();
};

export { localsMiddleware };
