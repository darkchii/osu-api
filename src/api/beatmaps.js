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

function buildQuery(req) {
  const mode = req.query.mode !== undefined ? req.query.mode : 0;
  let q = 'WHERE mode=? AND (approved=1 OR approved=2' + (req.query.include_loved ? ' OR approved=4' : '') + ')';
  const qVar = [mode];

  if (req.query.stars_min) {
    q += ' AND star_rating>=?';
    qVar.push(req.query.stars_min);
  }
  if (req.query.stars_max) {
    q += ' AND star_rating<?';
    qVar.push(req.query.stars_max);
  }
  if (req.query.ar_min) {
    q += ' AND ar>=?';
    qVar.push(req.query.ar_min);
  }
  if (req.query.ar_max) {
    q += ' AND ar<?';
    qVar.push(req.query.ar_max);
  }
  if (req.query.od_min) {
    q += ' AND od>=?';
    qVar.push(req.query.od_min);
  }
  if (req.query.od_max) {
    q += ' AND od<?';
    qVar.push(req.query.od_max);
  }
  if (req.query.cs_min) {
    q += ' AND cs>=?';
    qVar.push(req.query.cs_min);
  }
  if (req.query.cs_max) {
    q += ' AND cs<?';
    qVar.push(req.query.cs_max);
  }
  if (req.query.hp_min) {
    q += ' AND hp>=?';
    qVar.push(req.query.hp_min);
  }
  if (req.query.hp_max) {
    q += ' AND hp<?';
    qVar.push(req.query.hp_max);
  }
  if (req.query.length_min) {
    q += ' AND total_length>=?';
    qVar.push(req.query.length_min);
  }
  if (req.query.length_max) {
    q += ' AND total_length<?';
    qVar.push(req.query.length_max);
  }

  return [q, qVar];
}

router.get('/count', async (req, res) => {
  const connection = mysql.createConnection(connConfig);

  connection.on('error', (err) => {
    res.json({
      message: 'Unable to connect to database',
      error: err,
    });
  });

  const _res = buildQuery(req);
  const q = _res[0];
  const qVar = _res[1];

  const result = await connection.awaitQuery(`SELECT COUNT(*) as amount FROM beatmap ${q}`, qVar);

  res.json(result[0].amount);

  await connection.end();
});

router.get('/all', async (req, res) => {
  const connection = mysql.createConnection(connConfig);

  connection.on('error', (err) => {
    res.json({
      message: 'Unable to connect to database',
      error: err,
    });
  });

  const _res = buildQuery(req);
  const q = _res[0];
  const qVar = _res[1];

  const result = await connection.awaitQuery(`SELECT * FROM beatmap ${q}`, qVar);

  res.json(result);

  await connection.end();
});

router.get('/monthly', async (req, res) => {
  const connection = mysql.createConnection(connConfig);
  const mode = req.query.mode !== undefined ? req.query.mode : 0;

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

router.get('/yearly', async (req, res) => {
  const connection = mysql.createConnection(connConfig);
  const mode = req.query.mode !== undefined ? req.query.mode : 0;

  connection.on('error', (err) => {
    res.json({
      message: 'Unable to connect to database',
      error: err,
    });
  });

  const months = [];

  const _start = moment('6 Oct 2007');
  // var _end = moment(sorted[sorted.length - 1].actual_date).add(1, `${addDateFormat}s`);
  const _end = moment().add(1, 'years');
  for (let m = moment(_start); m.isBefore(_end); m.add(1, 'years')) {
    months.push(moment(m));
  }

  const result = await connection.awaitQuery('SELECT YEAR(approved_date) as year, SUM(total_length) as length, SUM(max_score) as score, COUNT(*) as amount FROM beatmap WHERE mode=? AND (approved=1 OR approved=2) GROUP BY YEAR(approved_date)', [mode]);

  res.json(result);

  await connection.end();
});

router.get('/:id', async (req, res) => {
  const connection = mysql.createConnection(connConfig);
  const mode = req.query.mode !== undefined ? req.query.mode : 0;

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

router.get('/:id/maxscore', async (req, res) => {
  const connection = mysql.createConnection(connConfig);
  const mode = req.query.mode !== undefined ? req.query.mode : 0;

  connection.on('error', (err) => {
    res.json({
      message: 'Unable to connect to database',
      error: err,
    });
  });

  const result = await connection.awaitQuery('SELECT max_score FROM beatmap WHERE beatmap_id=? AND mode=?', [req.params.id, mode]);

  res.json((result !== undefined && result[0] !== undefined) ? result[0].max_score : 0);
  connection.end();
});

module.exports = router;
