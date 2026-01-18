const express = require('express');
const path = require('path');
const session = require('express-session');
const supabase = require('./supabaseClient');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'En hemmelighed',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/pages'));
app.use('/', require('./routes/auth'));
app.use('/api/elever', require('./routes/elever'));
app.use('/api/laerere', require('./routes/laerere'));
app.use('/api/klasser', require('./routes/klasser'));
app.use('/api/karakterer', require('./routes/karakterer'));
app.use('/api/fravaer', require('./routes/fravaer'));
app.use('/api', require('./routes/api'));

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
