const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const { isAuthenticated, checkRole } = require('../middleware');

router.get('/', isAuthenticated, async (req, res) => {
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

router.get('/:id/details', isAuthenticated, async (req, res) => {
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

router.post('/add', isAuthenticated, checkRole(['admin', 'staff']), async (req, res) => {
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

router.put('/:id', isAuthenticated, checkRole(['admin', 'staff']), async (req, res) => {
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

router.delete('/:id', isAuthenticated, checkRole(['admin', 'staff']), async (req, res) => {
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


module.exports = router;
