const express = require('express');
const moment = require('moment');
const mysql = require('mysql-await');

const router = express.Router();

const connConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DB,
  password: process.env.MYSQL_PASS,
};

router.get('/monthly', async (req, res) => {
  const connection = mysql.createConnection(connConfig);
  const mode = req.query.mode??0;

  connection.on('error', (err) => {
    res.json({
      message: 'Unable to connect to database',
      error: err,
    });
  });

  const months = [];

  const _start = moment('6 Oct 2007');
  // var _end = moment(sorted[sorted.length - 1].actual_date).add(1, `${addDateFormat}s`);
  const _end = moment().add(1, 'months');
  for (let m = moment(_start); m.isBefore(_end); m.add(1, 'months')) {
    months.push(moment(m));
  }

  const result = await connection.awaitQuery('SELECT MONTH(approved_date) as month, YEAR(approved_date) as year, SUM(total_length) as length, SUM(max_score) as score, COUNT(*) as amount FROM beatmap WHERE mode=? AND (approved=1 OR approved=2) GROUP BY YEAR(approved_date), MONTH(approved_date)', [mode]);

  res.json(result);

  await connection.end();
});

router.get('/:id', async (req, res) => {
  const connection = mysql.createConnection(connConfig);
  const mode = req.query.mode??0;

  connection.on('error', (err) => {
    res.json({
      message: 'Unable to connect to database',
      error: err,
    });
  });

  const result = await connection.awaitQuery('SELECT * FROM beatmap WHERE beatmap_id=? AND mode=?', [req.params.id, mode]);

  res.json(result);
  connection.end();
});

module.exports = router;
