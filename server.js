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
  secret: process.env.SESSION_SECRET || 'En hemmelighed',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(express.static(path.join(__dirname, 'public')));

const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login.html');
};

const checkRole = (roles) => async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const { data, error } = await supabase
      .from('user_profiles')
      .select('rolle')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (roles.includes(data.rolle)) {
      return next();
    }

    res.status(403).json({ error: 'Forbidden' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
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

app.get('/elev', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'elev.html'));
});

app.get('/laerere', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'laerere.html'));
});

app.get('/laerer', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'laerer.html'));
});

app.get('/klasser', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'klasser.html'));
});

app.get('/klasse', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'klasse.html'));
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

app.get('/profile', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.get('/karakterer', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'karakterer.html'));
});

app.get('/fravaer', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'fravaer.html'));
});

// API routes
app.get('/api/fravaer', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { data: profile, error: profileError } = await supabase.from('user_profiles').select('rolle').eq('id', userId).single();
        if (profileError) throw profileError;

        let query = supabase.from('fravaer').select('id, dato, til_stede, elever(navn), fag(navn)');
        if (profile.rolle === 'student') {
            query = query.eq('elev', userId);
        }

        const { data, error } = await query;
        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching fravær:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/addFravaer', isAuthenticated, checkRole(['admin', 'staff']), async (req, res) => {
    try {
        const { elev, fag, dato, til_stede } = req.body;
        const { data, error } = await supabase.from('fravaer').insert([{ elev, fag, dato, til_stede }]).select().single();
        if (error) throw error;
        res.json({ message: 'Fravær created successfully', fravaer: data });
    } catch (err) {
        console.error('Error adding fravær:', err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/fravaer/:id', isAuthenticated, checkRole(['admin', 'staff']), async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('fravaer').delete().eq('id', id);
        if (error) throw error;
        res.json({ message: 'Fravær deleted successfully' });
    } catch (error) {
        console.error('Error deleting fravær:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/karakterer', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { data: profile, error: profileError } = await supabase.from('user_profiles').select('rolle').eq('id', userId).single();
        if (profileError) throw profileError;

        let query = supabase.from('karakterer').select('karakter, elev(navn), fag(navn)');
        if (profile.rolle === 'student') {
            query = query.eq('elev', userId);
        }

        const { data, error } = await query;
        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching karakterer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/addKarakter', isAuthenticated, checkRole(['admin', 'staff']), async (req, res) => {
    try {
        const { elev, fag, karakter } = req.body;
        const { data, error } = await supabase.from('karakterer').insert([{ elev, fag, karakter }]).select().single();
        if (error) throw error;
        res.json({ message: 'Karakter created successfully', karakter: data });
    } catch (err) {
        console.error('Error adding karakter:', err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/karakterer/:id', isAuthenticated, checkRole(['admin', 'staff']), async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('karakterer').delete().eq('id', id);
        if (error) throw error;
        res.json({ message: 'Karakter deleted successfully' });
    } catch (error) {
        console.error('Error deleting karakter:', error);
        res.status(500).json({ error: error.message });
    }
});


app.get('/api/user-classes', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { data, error } = await supabase
      .from('klasse_elever')
      .select('klasser(*, lærere(navn))')
      .eq('elev', userId);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching user's classes:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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

app.get('/api/elever/:id/details', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const { data: elev, error: elevError } = await supabase.from('elever').select('*').eq('id', id).single();
        if (elevError) throw elevError;

        const { data: schedule, error: scheduleError } = await supabase.from('skema').select('*, klasser(*, lærere(*))').eq('elev_id', id);
        if (scheduleError) throw scheduleError;

        const { data: grades, error: gradesError } = await supabase.from('karakterer').select('*, fag(*)').eq('elev', id);
        if (gradesError) throw gradesError;

        const { data: attendance, error: attendanceError } = await supabase.from('fravaer').select('*, fag(*)').eq('elev', id);
        if (attendanceError) throw attendanceError;

        res.json({ elev, schedule, grades, attendance });
    } catch (error) {
        console.error('Error fetching elev details:', error);
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

app.get('/api/laerere/:id/details', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const { data: laerer, error: laererError } = await supabase.from('lærere').select('*').eq('id', id).single();
        if (laererError) throw laererError;

        const { data: schedule, error: scheduleError } = await supabase.from('skema').select('*, klasser(*)').eq('lærer_id', id);
        if (scheduleError) throw scheduleError;

        const { data: classes, error: classesError } = await supabase.from('klasser').select('*').eq('lærer', id);
        if (classesError) throw classesError;

        res.json({ laerer, schedule, classes });
    } catch (error) {
        console.error('Error fetching laerer details:', error);
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

app.get('/api/klasser/:id/details', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const { data: klasse, error: klasseError } = await supabase.from('klasser').select('*, lærere(*)').eq('id', id).single();
        if (klasseError) throw klasseError;

        const { data: schedule, error: scheduleError } = await supabase.from('skema').select('*, lokale(*)').eq('klasse_id', id);
        if (scheduleError) throw scheduleError;

        const { data: students, error: studentsError } = await supabase.from('klasse_elever').select('*, elever(*)').eq('klasse_id', id);
        if (studentsError) throw studentsError;

        res.json({ klasse, schedule, students });
    } catch (error) {
        console.error('Error fetching klasse details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/klasser', isAuthenticated, async (req, res) => {
  try {
    const { data, error } = await supabase.from('klasser').select('id, fag, lærer(id, navn)');
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
      .select('start, slut, klasse, lokale(id)')
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

app.put('/api/elever/:id', isAuthenticated, checkRole(['admin', 'staff']), async (req, res) => {
  try {
    const { id } = req.params;
    const { navn, årgang } = req.body;

    const { data, error } = await supabase
      .from('elever')
      .update({ navn, årgang })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Elev updated successfully', elev: data });
  } catch (error) {
    console.error('Error updating elev:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/elever/:id', isAuthenticated, checkRole(['admin', 'staff']), async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from('elever').delete().eq('id', id);

    if (error) throw error;
    res.json({ message: 'Elev deleted successfully' });
  } catch (error) {
    console.error('Error deleting elev:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/addElev', isAuthenticated, checkRole(['admin', 'staff']), async (req, res) => {
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

app.post('/api/addLaerer', isAuthenticated, checkRole(['admin']), async (req, res) => {
    try {
        const { navn, initialer } = req.body;
        if (!navn || !initialer) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const { data, error } = await supabase.from('lærere').insert([{ navn, initialer }]).select().single();
        if (error) throw error;
        res.json({ message: 'Lærer created successfully', laerer: data });
    } catch (err) {
        console.error('Error adding laerer:', err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/laerere/:id', isAuthenticated, checkRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { navn, initialer } = req.body;
        const { data, error } = await supabase.from('lærere').update({ navn, initialer }).eq('id', id).select().single();
        if (error) throw error;
        res.json({ message: 'Lærer updated successfully', laerer: data });
    } catch (error) {
        console.error('Error updating laerer:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/laerere/:id', isAuthenticated, checkRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('lærere').delete().eq('id', id);
        if (error) throw error;
        res.json({ message: 'Lærer deleted successfully' });
    } catch (error) {
        console.error('Error deleting laerer:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/klasser/:id', isAuthenticated, checkRole(['admin', 'staff']), async (req, res) => {
    try {
        const { id } = req.params;
        const { fag, lærer } = req.body;
        const { data, error } = await supabase.from('klasser').update({ fag, lærer }).eq('id', id).select().single();
        if (error) throw error;
        res.json({ message: 'Klasse updated successfully', klasse: data });
    } catch (error) {
        console.error('Error updating klasse:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/klasser/:id', isAuthenticated, checkRole(['admin', 'staff']), async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('klasser').delete().eq('id', id);
        if (error) throw error;
        res.json({ message: 'Klasse deleted successfully' });
    } catch (error) {
        console.error('Error deleting klasse:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/addKlasse', isAuthenticated, checkRole(['admin', 'staff']), async (req, res) => {
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
