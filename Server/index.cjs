const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const MySQLStore = require('express-mysql-session')(session);
const axios = require('axios');
const app = express();
const nodemailer = require('nodemailer');
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


app.post('/login', async (req, res, next) => {
  const { email, password, captchaToken } = req.body;

  // Validate reCAPTCHA token
  const secretKey = '6LdB9kQpAAAAAJ9EtsaN0xGrFiN1r0juZGYUW50x'; // Replace with your actual secret key
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;

  try {
    const captchaResponse = await axios.post(verifyUrl);
    const { success: captchaSuccess } = captchaResponse.data;

    if (!captchaSuccess) {
      return res.status(401).json({ success: false, message: 'Captcha validation failed' });
    }

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
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    res.status(500).json({ success: false, message: 'Error verifying reCAPTCHA' });
  }
});



app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Generate a verification code (you can use a library like crypto-random-string)
  const verificationCode = generateVerificationCode();

  // Store the verification code in your database along with other user details
  const insertUserQuery = 'INSERT INTO users (username, email, password, verification_code) VALUES (?, ?, ?, ?)';

  try {
    await db.execute(insertUserQuery, [username, email, password, verificationCode]);

    // Send a verification email
    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({ success: true, message: 'Registration successful. Verification email sent.' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// Helper function to generate a random verification code
function generateVerificationCode() {
  // Generate a random buffer
  const buffer = crypto.randomBytes(5);
  
  // Convert the buffer to a hexadecimal string
  const verificationCode = buffer.toString('hex');
  
  return verificationCode;
}

// Helper function to send a verification email
async function sendVerificationEmail(email, verificationCode) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'triggered234adi@gmail.com',
      pass: 'ymbw ruzd nkbt gcox', 
    },
  });

  const mailOptions = {
    from: 'triggered234adi@gmail.com',
    to: email,
    subject: 'Verify Your Email',
    text: `Please click on the following link to verify your email: http://localhost:3002/verify-email?code=${verificationCode}`,
  };

  await transporter.sendMail(mailOptions);
}


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


app.get('/check-session', async (req, res) => {
  console.log('Before check session - isAuthenticated:', req.isAuthenticated());
  console.log('Session during check session:', req.session);

  if (req.isAuthenticated()) {
    console.log('Inside if condition - isAuthenticated:', req.isAuthenticated());

    const userId = req.user.ID; // Assuming you have the user ID in req.user

    try {
      const query = 'SELECT ID, email, is_admin FROM users WHERE ID = ?';
      const [results] = await db.execute(query, [userId]);

      if (results.length === 0) {
        console.log('User not found');
        return res.status(404).json({ loggedIn: false });
      }

      const user = {
        ID: results[0].ID,
        email: results[0].email,
        is_admin: results[0].is_admin, // Include the is_admin field
      };

      res.status(200).json({ loggedIn: true, user });
      console.log('Logged in');
    } catch (error) {
      console.error('Error checking session:', error);
      res.status(500).json({ loggedIn: false, message: 'Error checking session' });
    }
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

app.get('/fetch-experimental-cards', async (req, res) => {
  try {
    const query = 'SELECT card_text FROM card_requests WHERE review_count > 0 ORDER BY RAND() LIMIT 20';
    const [rows] = await db.execute(query);

    const selectedCards = rows.map((row) => row.card_text);
    res.status(200).json({ success: true, cards: selectedCards });
  } catch (error) {
    console.error('Error fetching experimental cards:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch experimental cards' });
  }
});


// ... (your existing code)
app.post('/pre-approve-question', async (req, res) => {
  const { questionId, cardPack } = req.body;

  try {
    // Increment the review_count of the approved question by 1
    const updateReviewCountQuery = 'UPDATE card_requests SET review_count = review_count + 1 WHERE id = ?';
    await db.execute(updateReviewCountQuery, [questionId]);

    res.status(200).json({ success: true, message: 'Question approved and sent for further review!' });
  } catch (error) {
    console.error('Error approving question:', error);
    res.status(500).json({ success: false, message: 'Failed to approve the question' });
  }
});

// ... (your existing code)

// ... (your existing code)

app.get('/verify-email', async (req, res) => {
  const verificationCode = req.query.code;

  if (!verificationCode) {
    return res.status(400).json({ success: false, message: 'Invalid verification code' });
  }

  try {
    const updateQuery = 'UPDATE users SET isVerified = true WHERE verification_code = ?';
    const [result] = await db.execute(updateQuery, [verificationCode]);

    if (result.affectedRows > 0) {
      return res.redirect('http://localhost:3000/');
    } else {
      return res.status(404).json({ success: false, message: 'Verification code not found' });
    }
  } catch (error) {
    console.error('Error verifying email:', error);
    return res.status(500).json({ success: false, message: 'Failed to verify email' });
  }
});

// Add these lines to your existing code

app.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Generate a unique token (you can use a library like crypto-random-string)
    const resetToken = generateResetToken();

    // Store the reset token, user email, and new password in your database
    const expirationTime = new Date();
expirationTime.setMinutes(expirationTime.getMinutes() + 5);

const insertTokenQuery = 'INSERT INTO password_reset_tokens (email, reset_token, new_password, reset_token_expiry) VALUES (?, ?, ?, ?)';
await db.execute(insertTokenQuery, [email, resetToken, newPassword, expirationTime]);

    // Send a password reset email
    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({ success: true, message: 'Password reset link sent to your email address.' });
  } catch (error) {
    console.error('Error initiating password reset:', error);
    res.status(500).json({ success: false, message: 'Failed to initiate password reset' });
  }
});

// Helper function to send a password reset email
async function sendPasswordResetEmail(email, resetToken) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'triggered234adi@gmail.com',
      pass: 'ymbw ruzd nkbt gcox', 
    },
  });

  const mailOptions = {
    from: 'triggered234adi@gmail.com',
    to: email,
    subject: 'Password Reset',
    text: `To reset your password, click on the following link: http://localhost:3002/complete-reset-password?token=${resetToken}`,
  };

  await transporter.sendMail(mailOptions);
}

// Helper function to find a user by reset token
async function findUserByResetToken(token) {
  const query = 'SELECT * FROM password_reset_tokens WHERE reset_token = ?';
  const [results] = await db.execute(query, [token]);

  if (results.length === 0) {
    return null;
  }

  const user = {
    id: results[0].user_id,
    reset_token_expiry: results[0].reset_token_expiry,
  };

  return user;
}

async function findUserByResetToken(token) {
  const query = 'SELECT email, new_password, reset_token_expiry FROM password_reset_tokens WHERE reset_token = ?';
  const [results] = await db.execute(query, [token]);

  if (results.length === 0) {
    return null;
  }

  const user = {
    email: results[0].email,
    newPassword: results[0].new_password,
    reset_token_expiry: results[0].reset_token_expiry,
  };

  return user;
}



app.get('/complete-reset-password', async (req, res) => {
  const resetToken = req.query.token; // Extract resetToken from URL parameter

  try {
    const user = await findUserByResetToken(resetToken);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Invalid or expired reset token' });
    }

    // Check if the reset token is still valid
    if (new Date(user.reset_token_expiry) < new Date()) {
      return res.status(401).json({ success: false, message: 'Reset token has expired' });
    }

    // Update the user's password and clear the reset token
    const updateQuery = 'UPDATE users SET password = ? WHERE email = ?';

    // Ensure that newPassword is defined before passing it to db.execute
    if (user.newPassword) {
      await db.execute(updateQuery, [user.newPassword, user.email]);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid request parameters' });
    }

    // Optionally, you can clear the reset token from the token table here if needed
    // const clearTokenQuery = 'DELETE FROM password_reset_tokens WHERE reset_token = ?';
    // await db.execute(clearTokenQuery, [resetToken]);

    return res.redirect('http://localhost:3000/');
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
});



function generateResetToken() {
  // Generate a random buffer
  const buffer = crypto.randomBytes(32);
  
  // Convert the buffer to a hexadecimal string
  const resetToken = buffer.toString('hex');
  
  return resetToken;
}

app.post('/approve-question', async (req, res) => {
  const { questionId, cardPack } = req.body;

  try {
    // Insert approved question into cards table
    const insertQuery = 'INSERT INTO cards (card_text, card_pack) SELECT card_text, ? FROM card_requests WHERE id = ?';
    await db.execute(insertQuery, [cardPack, questionId]);

    // Delete the approved question from card_requests table
    const deleteQuery = 'DELETE FROM card_requests WHERE id = ?';
    await db.execute(deleteQuery, [questionId]);

    res.status(200).json({ success: true, message: 'Question approved and added to cards' });
  } catch (error) {
    console.error('Error approving question:', error);
    res.status(500).json({ success: false, message: 'Failed to approve the question' });
  }
});

app.get('/pre-fetch-submitted-questions', async (req, res) => {
  try {
    const query = 'SELECT id, card_text FROM card_requests WHERE review_count = 0';
    const [rows] = await db.execute(query);

    res.status(200).json({ success: true, questions: rows });
  } catch (error) {
    console.error('Error fetching submitted questions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch submitted questions' });
  }
});

app.get('/fetch-submitted-questions', async (req, res) => {
  try {
    const query = 'SELECT id, card_text FROM card_requests WHERE review_count > 1';
    const [rows] = await db.execute(query);

    res.status(200).json({ success: true, questions: rows });
  } catch (error) {
    console.error('Error fetching submitted questions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch submitted questions' });
  }
});
// ... (existing code)

app.post('/reject-question', async (req, res) => {
  const { questionId } = req.body;

  try {
    // Perform action to reject the question (e.g., delete from the submission table)
    const deleteQuery = 'DELETE FROM card_requests WHERE id = ?';
    await db.execute(deleteQuery, [questionId]);

    res.status(200).json({ success: true, message: 'Question rejected' });
  } catch (error) {
    console.error('Error rejecting question:', error);
    res.status(500).json({ success: false, message: 'Failed to reject the question' });
  }
});

app.post('/edit-question', async (req, res) => {
  const { questionId, newText } = req.body;

  if (!questionId || !newText) {
    return res.status(400).json({ success: false, message: 'Invalid request parameters' });
  }

  try {
    const updateQuery = 'UPDATE card_requests SET card_text = ? WHERE id = ?';
    await db.execute(updateQuery, [newText, questionId]);

    res.status(200).json({ success: true, message: 'Question edited' });
  } catch (error) {
    console.error('Error editing question:', error);
    res.status(500).json({ success: false, message: 'Failed to edit the question' });
  }
});


app.post('/add-question', async (req, res) => {
  const { card_text, card_pack } = req.body;

  if (!card_text || !card_pack) {
    return res.status(400).json({ success: false, message: 'Invalid request parameters' });
  }

  try {
    const insertQuery = 'INSERT INTO cards (card_text, card_pack) VALUES (?, ?)';
    await db.execute(insertQuery, [card_text, card_pack]);

    res.status(200).json({ success: true, message: 'Question added successfully' });
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ success: false, message: 'Failed to add the question' });
  }
});

app.post('/request-question', async (req, res) => {
  const { userId, question } = req.body;

  if (!userId || !question) {
    return res.status(400).json({ success: false, message: 'Invalid request parameters' });
  }

  try {
    const insertQuery = 'INSERT INTO card_requests (user_id, card_text) VALUES (?, ?)';
    await db.execute(insertQuery, [userId, question]);

    res.status(200).json({ success: true, message: 'Question request sent successfully' });
  } catch (error) {
    console.error('Error sending question request:', error);
    res.status(500).json({ success: false, message: 'Failed to send the question request' });
  }
});

app.put('/increment-review-count', async (req, res) => {
  const { card, increment } = req.body;

  try {
    const incrementValue = increment ? 1 : -1; // Increment or decrement based on 'increment' flag

    const updateQuery = 'UPDATE card_requests SET review_count = review_count + ? WHERE card_text = ?';
    await db.execute(updateQuery, [incrementValue, card]);

    res.status(200).json({ success: true, message: 'Review count updated successfully' });
  } catch (error) {
    console.error('Error updating review count:', error);
    res.status(500).json({ success: false, message: 'Failed to update review count' });
  }
});

app.get('/user-reviews', async (req, res) => {
  const userId = req.user.ID;

  try {
    const query = 'SELECT ID, card_text, review_count AS status FROM card_requests WHERE user_id = ?';
    const [rows] = await db.execute(query, [userId]);

    res.status(200).json({ success: true, reviews: rows });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user reviews' });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// ... (your existing routes)