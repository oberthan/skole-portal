const supabase = require('./supabaseClient');

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

module.exports = { isAuthenticated, checkRole };
