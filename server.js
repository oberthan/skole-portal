const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'a-very-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(express.static(path.join(__dirname, 'public')));

// Mock user credentials
const mockUser = {
  username: 'admin',
  password: 'password'
};

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login.html');
};

// Routes
app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login.html');
    }
});

app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === mockUser.username && password === mockUser.password) {
    req.session.user = { username };
    res.redirect('/dashboard');
  } else {
    res.redirect('/login.html');
  }
});

app.get('/dashboard', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/elever', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'elever.html'));
});

app.get('/laerere', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'laerere.html'));
});

app.get('/klasser', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'klasser.html'));
});

app.get('/fag', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'fag.html'));
});

app.get('/skema', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'skema.html'));
});

app.get('/lokaler', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'lokaler.html'));
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/dashboard');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login.html');
  });
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
