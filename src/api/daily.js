const express = require('express');
const { GetUser, GetDailyUser } = require('../osu');
const apicache = require('apicache');

const router = express.Router();
let cache = apicache.middleware;

router.get('/:id', cache('1 day'), async (req, res) => {
    const mode = req.query.mode !== undefined ? req.query.mode : 0;
    let user = null;
    try {
        user = await GetDailyUser(req.params.id, 0, 'id');
    } catch (err) {
        res.json({ error: 'Unable to get user' });
    }
    if (user !== null) {
        res.json(user);
    }
    // res.json(user);
});

module.exports = router;
