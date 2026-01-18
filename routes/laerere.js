const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const { isAuthenticated, checkRole } = require('../middleware');

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const { data, error } = await supabase.from('lærere').select('id, navn, initialer');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching lærere:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id/details', isAuthenticated, async (req, res) => {
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

router.post('/add', isAuthenticated, checkRole(['admin']), async (req, res) => {
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

router.put('/:id', isAuthenticated, checkRole(['admin']), async (req, res) => {
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

router.delete('/:id', isAuthenticated, checkRole(['admin']), async (req, res) => {
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

module.exports = router;
