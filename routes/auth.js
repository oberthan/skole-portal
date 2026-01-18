const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const path = require('path');

router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: `${username}@myapp.local`,
    password: password,
  });

  if (error) {
    console.error('Login error:', error.message);
    return res.redirect('/login.html');
  }

  if (data.user) {
    req.session.user = data.user;
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/dashboard');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login.html');
  });
});

module.exports = router;
