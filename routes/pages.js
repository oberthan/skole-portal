const express = require('express');
const router = express.Router();
const path = require('path');
const { isAuthenticated } = require('../middleware');

router.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

router.get('/dashboard', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'dashboard.html'));
});

router.get('/elever', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'elever.html'));
});

router.get('/elev', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'elev.html'));
});

router.get('/laerere', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'laerere.html'));
});

router.get('/laerer', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'laerer.html'));
});

router.get('/klasser', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'klasser.html'));
});

router.get('/klasse', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'klasse.html'));
});

router.get('/fag', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'fag.html'));
});

router.get('/skema', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'skema.html'));
});

router.get('/lokaler', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'lokaler.html'));
});

router.get('/profile', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'profile.html'));
});

router.get('/karakterer', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'karakterer.html'));
});

router.get('/fravaer', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'fravaer.html'));
});

router.get('/health-check',(req, res) => {
    res.status(200).send();
});
module.exports = router;
