const express = require('express');
const { GetUser } = require('../osu');

const router = express.Router();

router.get('/:id', async (req, res) => {
  const mode = req.query.mode !== undefined ? req.query.mode : 0;
  let user = null;
  try {
    user = await GetUser(req.params.id, 'osu', 'id');
  } catch (err) {
    try {
      user = await GetUser(req.params.id, 'osu', 'username');
    } catch (_err) {
      res.json({ error: 'Unable to get user' });
    }
  }
  if (user !== null) {
    res.json(user);
  }
  // res.json(user);
});

module.exports = router;
