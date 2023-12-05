const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const MySQLStore = require('express-mysql-session')(session);

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  port: '3306',
  database: 'get_social',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db = pool.promise();

const sessionStore = new MySQLStore({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'get_social',
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 86400000,
  createDatabaseTable: true,
});

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: false,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (req, user, done) => {
  const userId = user.ID;

  if (userId && req.session.passport && req.session.passport.user && req.session.passport.user.ID === userId) {
    const query = 'SELECT * FROM users WHERE ID = ?';

    try {
      const [results] = await db.execute(query, [userId]);

      if (results.length === 0) {
        return done(null, false);
      }

      const deserializedUser = {
        ID: results[0].ID,
        email: results[0].email,
      };

      done(null, deserializedUser);
    } catch (error) {
      console.error('Error deserializing user:', error);
      done(error, false);
    }
  } else {
    done(null, false);
  }
});


async function authenticateUser(email, password, done) {
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';

  try {
    const [results] = await db.execute(query, [email, password]);

    if (results.length > 0) {
      return done(null, { ID: results[0].ID, email: results[0].email });
    } else {
      return done(null, false, { message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error authenticating user:', error);
    return done(error);
  }
}


app.post('/login', (req, res, next) => {

  if (req.isAuthenticated()) {
    return res.status(200).json({ success: true, message: 'Already authenticated' });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ success: false, message: info.message });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }

      req.session.passport = { user: { ID: user.ID, email: user.email } };

      req.session.save((saveErr) => {
        if (saveErr) {
          return next(saveErr);
        }

        console.log('After login - isAuthenticated:', req.isAuthenticated());
        console.log('Session after login:', req.session);

        res.status(200).json({ success: true, message: 'Login successful' });
      });
    });
  })(req, res, next);
});


app.post('/register', async (req, res) =>{
  const { username, email, password } = req.body;
  const query = 'INSERT INTO users (username, email, password) VALUES ( ?, ?, ?)';

  try {
    await db.execute(query, [username, email, password]);
    res.status(200).json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});


app.post('/logout', (req, res) => {

  if (req.isAuthenticated()) {
    console.log('Utilizatgorul este autentificat, urmeaza logout');

    req.logout((err) => {
      if (err) {
        console.error('Error during logout:', err);
        return res.status(500).json({ success: false, message: 'Logout failed' });
      }

      res.clearCookie('connect.sid', {
        path: '/', 
        httpOnly: true,
        secure: false,
        sameSite: 'None',
      });

      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          console.error('Error destroying session:', destroyErr);
          return res.status(500).json({ success: false, message: 'Logout failed' });
        }

        console.log('User logged out');
        return res.status(200).json({ success: true, message: 'Logout successful' });
      });
    });
  } else {
    console.log('Utilizatorul nu este autentificat');
    return res.status(200).json({ success: true, message: 'Logout successful' });
  }
});


app.get('/check-session', (req, res) => {
  console.log('Before check session - isAuthenticated:', req.isAuthenticated());
  console.log('Session during check session:', req.session);

  if (req.isAuthenticated()) {
    console.log('Inside if condition - isAuthenticated:', req.isAuthenticated());
    res.status(200).json({ loggedIn: true, user: req.user });
    console.log('Logged in');
  } else {
    console.log('Inside else condition - isAuthenticated:', req.isAuthenticated());
    console.log('Login failed: User not logged in');
    res.status(200).json({ loggedIn: false });
  }
});


app.get('/fetch-cards', async (req, res) => {
  const selectedPack = req.query.pack;

  try {
    const query = 'SELECT card_text FROM cards WHERE card_pack = ? ORDER BY RAND() LIMIT 20';
    const [rows] = await db.execute(query, [selectedPack]);

    const selectedCards = rows.map((row) => row.card_text);
    res.status(200).json({ success: true, cards: selectedCards });
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch cards' });
  }
});




const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// ... (your existing routes)