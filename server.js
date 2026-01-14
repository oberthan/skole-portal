const express = require('express');
const path = require('path');
const session = require('express-session');
const supabase = require('./supabaseClient');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-default-secret-for-development',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(express.static(path.join(__dirname, 'public')));

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

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: username,
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

// API routes
app.get('/api/dashboard-stats', isAuthenticated, async (req, res) => {
  try {
    const { data: elever, error: eleverError } = await supabase.from('elever').select('*', { count: 'exact', head: true });
    if (eleverError) throw eleverError;

    const { data: laerere, error: laerereError } = await supabase.from('lærere').select('*', { count: 'exact', head: true });
    if (laerereError) throw laerereError;

    const { data: klasser, error: klasserError } = await supabase.from('klasser').select('*', { count: 'exact', head: true });
    if (klasserError) throw klasserError;

    const { data: fag, error: fagError } = await supabase.from('fag').select('*', { count: 'exact', head: true });
    if (fagError) throw fagError;

    res.json({
      elever: elever.count,
      laerere: laerere.count,
      klasser: klasser.count,
      fag: fag.count
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/todays-schedule', isAuthenticated, async (req, res) => {
  try {
    let today = new Date().getDay();
    today = today === 0 ? 7 : today; // Map Sunday from 0 to 7

    const { data, error } = await supabase
      .from('skema')
      .select('*, fag(navn), lærere(navn), klasser(navn)')
      .eq('ugedag', today)
      .order('start_tid');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching today\'s schedule:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/recent-students', isAuthenticated, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('elever')
      .select('navn, email, klasser(navn)')
      .order('id', { ascending: false })
      .limit(5);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching recent students:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/elever', isAuthenticated, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('elever')
      .select('id, navn, email, klasser(navn)');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching elever:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/laerere', isAuthenticated, async (req, res) => {
  try {
    const { data, error } = await supabase.from('lærere').select('id, navn, email, telefon');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching lærere:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/klasser', isAuthenticated, async (req, res) => {
  try {
    const { data, error } = await supabase.from('klasser').select('id, navn, lærere(navn)');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching klasser:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/fag', isAuthenticated, async (req, res) => {
  try {
    const { data, error } = await supabase.from('fag').select('id, navn, lærere(navn)');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching fag:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/skema', isAuthenticated, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('skema')
      .select('id, ugedag, start_tid, slut_tid, fag(navn), klasser(navn), lærere(navn), lokale(navn)')
      .order('ugedag').order('start_tid');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching skema:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/lokaler', isAuthenticated, async (req, res) => {
  try {
    const { data, error } = await supabase.from('lokale').select('navn');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching lokaler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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
