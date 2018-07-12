const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

module.exports = function(pool) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    console.log('starting deserializeUser github user');

    const queryText = 'select * from users where id = $1';

    pool.query(queryText, [id])
      .then(result => {
        const user = result.rows[0]
        console.log('deserialize github result: ')
        console.log(user.id);

        // passport deserialize done
        done(null, user)
      })
      .catch(err => {
        if (err) throw new Error(err);
      })
  });
    passport.use(
      new GitHubStrategy({
        clientID: process.env.githubClientID,
        clientSecret: process.env.githubClientSecret,
        callbackURL: '/auth/github/callback',
        proxy: true
      },
      (accessToken, refreshToken, profile, done) => {
        // this is where we upsert the profile id, name(screename), and primary email
        const id = profile.id;
        const name = profile.displayName;
        console.log(profile)

        const queryText = 'insert into users (id, name) ' +
          'values ($1, $2) ' +
          'on conflict (id) do update set name=$2 ' +
          'returning *';

        console.log(pool);
        pool.query(queryText, [id, name])
          .then(result => {
            console.log(result.rows);

            console.log(result.rows)
            const user = result.rows[0]
            console.log('github auth:')
            console.log(user.id)

            // passport deserialize complete
            done(null, user);
          })
          .catch(err => {
            if (err) throw new Error(err);
          }
        );
      }
    )
  )
};

