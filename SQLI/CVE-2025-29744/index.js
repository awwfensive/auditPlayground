const express = require('express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();

const db = pgp({
  host: 'db',
  user: 'devuser',
  password: 'devpassword',
  database: 'users',
});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/test', async (req, res) => {
  const attackerControlled1 = req.body.input1;
  const attackerControlled2 = req.body.input2;

  try {
    const r = await db.any(
      'SELECT * FROM pg_promise_example WHERE result=-$1 AND name=$2;',
      [parseInt(attackerControlled1), attackerControlled2]
    );

    res.send(`
      <h2>Query Result:</h2>
      <pre>${JSON.stringify(r, null, 2)}</pre>
      <a href="/">Back</a>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error executing query.');
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
