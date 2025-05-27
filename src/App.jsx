import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Low');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get('http://localhost:5000/tasks')
      .then(res => setTasks(res.data));
  };

  const addTask = () => {
    axios.post('http://localhost:5000/tasks', {
      title, due_date: dueDate, priority
    }).then(() => {
      fetchTasks();
      setTitle('');
      setDueDate('');
      setPriority('Low');
    });
  };

  const markDone = (id, done) => {
    axios.put(`http://localhost:5000/tasks/${id}`, { done: !done })
      .then(fetchTasks);
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`)
      .then(fetchTasks);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2><u>📝 PlanMate - Daily Planner</u></h2><br/>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Task title" /><br/>
      <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} /><br/>
      <select value={priority} onChange={e => setPriority(e.target.value)}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select><br/><br/>
      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map(task => (
          <li key={task.id} style={{ marginTop: '20px' }}>
            <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
              {task.title} (Due: {task.due_date}) [{task.priority}]
            </span>
            <button onClick={() => markDone(task.id, task.done)}>
              {task.done ? 'Undo' : 'Done'}
            </button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
