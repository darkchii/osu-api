const express = require('express');

const beatmaps = require('./beatmaps');
const user = require('./user');

const router = express.Router();

router.use('/beatmaps', beatmaps);
router.use('/users', user);

module.exports = router;
