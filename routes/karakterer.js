const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const { isAuthenticated, checkRole } = require('../middleware');

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { data: profile, error: profileError } = await supabase.from('user_profiles').select('rolle').eq('id', userId).single();
        if (profileError) throw profileError;

        let query = supabase.from('karakterer').select('id, karakter, elever(navn), fag(navn)');
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

router.post('/add', isAuthenticated, checkRole(['admin', 'staff']), async (req, res) => {
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

router.delete('/:id', isAuthenticated, checkRole(['admin', 'staff']), async (req, res) => {
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

module.exports = router;
