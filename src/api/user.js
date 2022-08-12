const express = require('express');
const { GetUser } = require('../osu');

const router = express.Router();

router.get('/:id', async (req, res) => {
  const mode = req.query.mode !== undefined ? req.query.mode : 0;
  try {
    const user = await GetUser(req.params.id, 'osu', 'id');
    res.json(user);
  } catch (err) {
    res.json({ error: 'Unable to get user' });
  }
  // res.json(user);
});

module.exports = router;
