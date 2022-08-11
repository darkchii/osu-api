const express = require('express');

const beatmaps = require('./beatmaps');

const router = express.Router();

router.use('/beatmaps', beatmaps);

module.exports = router;
