import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("tasks"));
    return saved || []; // load tasks from localStorage on page load
  });
  const [input, setInput] = useState("");   //Input field value
  const [dueDate, setDueDate] = useState(""); // due date value
  const inputRef = useRef(null); // reference to the input box

  // save tasks to localStorage every time tasks changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask() {
    if (input.trim() === "") return; // prevents adding empty tasks
    setTasks([...tasks, { text: input, completed: false, dueDate: dueDate }]); // adds the new task
    setInput("");    // clears input box
    setDueDate("");  // clears due date
    inputRef.current.focus(); // refocus input box after adding task
  }

  function deleteTask(index) {
    setTasks(tasks.filter((_, i) => i !== index)); // removes task
  }

  function toggleTask(index) {
    setTasks(tasks.map((task, i) => // complete task
      i === index ? { ...task, completed: !task.completed } : task
    ));
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") addTask(); // enter to add task
  }

  function formatDate(dateStr) {
    if (!dateStr) return ""; // no date set
    const [year, month, day] = dateStr.split("-");
    return `${month}/${day}/${year}`; // formats to MM/DD/YYYY
  }

  function isOverdue(dateStr, completed) {
    if (!dateStr || completed) return false; // no date or already completed
    return new Date(dateStr) < new Date(new Date().toDateString()); // checks if past due
  }

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">To-Do</h1>

        {/* input row for adding new tasks */}
        <div className="input-row">
          <input
            className="input"
            type="text"
            placeholder="Enter a task..."
            value={input}
            ref={inputRef}
            onChange={(e) => setInput(e.target.value)} // updates input as user types
            onKeyDown={handleKeyDown} // press enter to add task
          />
          <input
            className="date-input"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)} // updates due date as user picks
          />
          <button className="add-button" onClick={addTask}>Add</button>
        </div>

        {/* list of tasks */}
        <ul className="list">
          {tasks.map((task, index) => (
            <li key={index} className="list-item">
              {/* shows task text, strikethrough if completed, red if overdue */}
              <span className={`task-text ${task.completed ? "completed" : ""} ${isOverdue(task.dueDate, task.completed) ? "overdue" : ""}`}>
                {task.text}{task.dueDate ? ` - ${formatDate(task.dueDate)}` : ""}
              </span>
              {/* toggles task between complete and not complete */}
              <button className={`complete-button ${task.completed ? "completed" : ""}`} onClick={() => toggleTask(index)}>
                {task.completed ? "Undo" : "✅"}
              </button>
              {/* deletes task from list */}
              <button className="delete-button" onClick={() => deleteTask(index)}>🗑️</button>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}

export default App;