import React, { useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]); // List of tasks
  const [input, setInput] = useState(""); //Input field value

  function addTask() {
    if (input.trim() === "") return; // prevents adding empty tasks
    setTasks([...tasks, { text: input, completed: false }]); // adds the new task
    setInput(""); // clears input box
  }

  function deleteTask(index) {
    setTasks(tasks.filter((_, i) => i !== index)); // removes task
  }

  function toggleTask(index) {
    setTasks(tasks.map((task, i) => // toggles completed state of task
      i === index ? { ...task, completed: !task.completed } : task
    ));
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") addTask(); // enter to add task
  }

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">📝 To-Do List</h1>

        <div className="input-row">
          <input
            className="input"
            type="text"
            placeholder="Enter a task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="add-button" onClick={addTask}>Add</button>
        </div>

        <ul className="list">
          {tasks.map((task, index) => (
            <li key={index} className="list-item">
              <span className={`task-text ${task.completed ? "completed" : ""}`}>{task.text}</span>
              <button className={`complete-button ${task.completed ? "completed" : ""}`} onClick={() => toggleTask(index)}>
                {task.completed ? "Undo" : "✅"}
              </button>
              <button className="delete-button" onClick={() => deleteTask(index)}>🗑️</button>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}

export default App;