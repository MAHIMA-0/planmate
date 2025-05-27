const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // your MySQL password
  database: 'planmate'
});

db.connect(err => {
  if (err) {
    console.error('DB connection error:', err);
  } else {
    console.log('Connected to MySQL database.');
  }
});

// Routes


app.get('/', (req, res) => {
  res.send('Welcome to PlanMate backend API');
});


app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// Add a task
app.post('/tasks', (req, res) => {
  const { title, due_date, priority } = req.body;
  const query = 'INSERT INTO tasks (title, due_date, priority) VALUES (?, ?, ?)';
  db.query(query, [title, due_date, priority], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Task added successfully.' });
  });
});

// Update a task
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { done } = req.body;
  const query = 'UPDATE tasks SET done = ? WHERE id = ?';
  db.query(query, [done, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Task updated.' });
  });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Task deleted.' });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
