// server/passport-config.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const users = [
  {
    id: 1,
    username: 'user1',
    password: 'password1',
  },
  // Add more users as needed
];

passport.use(
  new LocalStrategy((username, password, done) => {
    const user = users.find((user) => user.username === username);

    if (!user || user.password !== password) {
      return done(null, false, { message: 'Incorrect username or password' });
    }

    return done(null, user);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find((user) => user.id === id);
  done(null, user);
});
