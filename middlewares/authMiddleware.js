module.exports = {
    ensureAuth: (req, res, next) => {
      if (req.session.user) {
        return next();
      } else {
        req.flash('error', 'Please login to view this page');
        res.redirect('/login');
      }
    },
    ensureGuest: (req, res, next) => {
      if (!req.session.user) {
        return next();
      } else {
        res.redirect('/dashboard');
      }
    }
  };
  