const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const { isAuthenticated, checkRole } = require('../middleware');

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const { data, error } = await supabase.from('klasser').select('id, fag, lærer(id, navn)');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching klasser:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id/details', isAuthenticated, async (req, res) => {
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

router.post('/add', isAuthenticated, checkRole(['admin', 'staff']), async (req, res) => {
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

router.put('/:id', isAuthenticated, checkRole(['admin', 'staff']), async (req, res) => {
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

router.delete('/:id', isAuthenticated, checkRole(['admin', 'staff']), async (req, res) => {
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

module.exports = router;
