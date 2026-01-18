const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const { isAuthenticated } = require('../middleware');

router.get('/user-classes', isAuthenticated, async (req, res) => {
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

router.get('/dashboard-stats', isAuthenticated, async (req, res) => {
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

router.get('/todays-schedule', isAuthenticated, async (req, res) => {
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

router.get('/recent-students', isAuthenticated, async (req, res) => {
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

router.get('/fag', isAuthenticated, async (req, res) => {
  try {
    const { data, error } = await supabase.from('fag').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching fag:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/skema', isAuthenticated, async (req, res) => {
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

router.get('/lokaler', isAuthenticated, async (req, res) => {
  try {
    const { data, error } = await supabase.from('lokale').select('id');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching lokaler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/getProfile', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;

    const { data, error } = await supabase
        .from('user_profiles')
        .select('navn, rolle')
        .eq('id', userId)
        .single();
    if (error) throw error;

    if (!data) return res.status(403).json({ error: 'No profile found' });
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

module.exports = router;
