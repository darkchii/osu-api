const express = require('express');
const axios = require('axios');

const beatmaps = require('./beatmaps');
const user = require('./user');
const daily = require('./daily');

const router = express.Router();

router.get('/proxy/:url', async (req, res) => {
  const url = Buffer.from(req.params.url, 'base64').toString('utf-8');
  const _res = await axios.get(url);

  res.json(_res.data);
});

router.use('/beatmaps', beatmaps);
router.use('/users', user);
router.use('/daily', daily);


module.exports = router;
