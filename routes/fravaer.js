const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const { isAuthenticated, checkRole } = require('../middleware');

router.get('/', isAuthenticated, async (req, res) => {
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

router.post('/add', isAuthenticated, checkRole(['admin', 'staff']), async (req, res) => {
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

router.delete('/:id', isAuthenticated, checkRole(['admin', 'staff']), async (req, res) => {
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

module.exports = router;
