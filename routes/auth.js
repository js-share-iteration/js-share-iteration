const passport = require('passport');

module.exports = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/documents');
    }
  );

  app.get(
    '/auth/github',
    passport.authenticate('github', {
      scope: ['id']
    })
  );

  app.get(
    '/auth/github/callback',
    passport.authenticate('github'),
    (req, res) => {
      res.redirect('/documents')
    }
  );

  app.get('/api/logout', (req, res) => {
    req.logout(); // logout added by passport
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user); // req.user generated from cookie session and passport
  });
};

