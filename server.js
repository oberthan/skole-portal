const express = require('express');
const path = require('path');
const session = require('express-session');
const supabase = require('./supabaseClient');

const app = express();
const port = process.env.PORT || 80;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
        res.redirect('/login');
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

app.get('/dashboard', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
    //res.sendFile('public/dashboard.html');
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
    const { count: elever, error: eleverError } = await supabase.from('elever').select('*', { count: 'exact', head: true });
    if (eleverError) throw eleverError;

    const { count: laerere, error: laerereError } = await supabase.from('lærere').select('*', { count: 'exact', head: true });
    if (laerereError) throw laerereError;

    const { count: klasser, error: klasserError } = await supabase.from('klasser').select('*', { count: 'exact', head: true });
    if (klasserError) throw klasserError;

    const { count: fag, error: fagError } = await supabase.from('fag').select('*', { count: 'exact', head: true });
    if (fagError) throw fagError;

    res.json({
      elever: elever,
      laerere: laerere,
      klasser: klasser,
      fag: fag
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/todays-schedule', isAuthenticated, async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

    const { data, error } = await supabase
        .from('skema')
        .select('*')
        .gte('start', today)
        .lt('start', tomorrow)
        .order('start');

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
      .select('navn, årgang')
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
      .select('id, navn, årgang');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching elever:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/laerere', isAuthenticated, async (req, res) => {
  try {
    const { data, error } = await supabase.from('lærere').select('id, navn, initialer');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching lærere:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/klasser', isAuthenticated, async (req, res) => {
  try {
    const { data, error } = await supabase.from('klasser').select('id, fag, lærer(navn)');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching klasser:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/fag', isAuthenticated, async (req, res) => {
  try {
    const { data, error } = await supabase.from('fag').select('*');//'id, navn, niveau');
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
      .select('start, slut, klasser, lokale(id)')
      .order('start');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching skema:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/lokaler', isAuthenticated, async (req, res) => {
  try {
    const { data, error } = await supabase.from('lokale').select('id');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching lokaler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getProfile', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;

    const { data, error } = await supabase
        .from('user_profiles')
        .select('navn, rolle')
        .eq('id', userId)
        .single();
    if (error) throw error;

    if (!data) return res.status(403).json({ error: 'No profile found' });
    // Make available everywhere
    res.json({
      id: userId,
      navn: data.navn,
      rolle: data.rolle,
      avatar: `https://i.pravatar.cc/40?u=${userId}`
    });



  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/addElev', isAuthenticated, async (req, res) => {
  try {
    let { navn, aargang } = req.body;

    if (!aargang) aargang = new Date().getFullYear();


    if (!navn ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create elev row first (with bruger = NULL)
    const { data: elevData, error: elevError } = await supabase
        .from('elever')
        .insert([{ navn, årgang: aargang, bruger: null }])
        .select()
        .single();

    if (elevError){console.log("ElevError");
      throw elevError;}

    let username = '';
    let nameList = navn.split(' ');
    nameList.forEach((item, i) => {
      let numChars = Math.floor(4/nameList.length);
      let remainder = (4/nameList.length)%1
      if (i/nameList.length <= remainder) numChars += 1;

      for(let j = 0; j < numChars; j++) {
        let letter = item.charAt(j);
        username += letter === ''? 'x' : letter;
      }
    });
    username += elevData.id.toString()

    let password = Math.random().toString(36).slice(-8)

    const { data: newUser, error: userError } = await supabase.auth.admin.createUser({
      email: `${username}@myapp.local`,
      password: password,
      email_confirm: true
    });

    if (userError) {
      // Roll back the elev if auth creation fails
      await supabase.from('elever').delete().eq('id', elevData.id);
      console.log("UserError");
      throw userError;
    }


    console.log('newUser.id (type):', typeof newUser.user.id, newUser.user.id);


    // Update elev with the new bruger id
    const { data: updatedElev, error: updateError } = await supabase
        .from('elever')
        .update({ bruger: newUser.user.id })
        .eq('id', elevData.id)
        .select()
        .single();

    if (updateError){console.log("UpdateError"); throw updateError;}

    res.json({
      message: 'Elev created successfully',
      elev: updatedElev,
      email: `${username}@myapp.local`,
      password: password,
    });

  } catch (err) {
    console.error('Error adding elev:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/addKlasse', isAuthenticated, async (req, res) => {
  try {
    let { laerer, fag } = req.body;

    const { data: klasseData, error: klasseError } = await supabase
        .from('klasser')
        .insert([{ lærer:laerer, fag}])
        .select()
        .single();

    if (klasseError){console.log("KlasseError");
      throw klasseError;}


    res.json({
      message: 'Klasse created successfully',
      klasse: klasseData

    });

  } catch (err) {
    console.error('Error adding klasse:', err);
    res.status(500).json({ error: err.message });
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

app.get('/health-check', (req, res) => {
  res.status(200).json({});
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
