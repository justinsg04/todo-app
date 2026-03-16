import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import UndoIcon from "@mui/icons-material/Undo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("tasks"));
    return saved || []; // load tasks from localStorage on page load
  });
  const [input, setInput] = useState("");   //Input field value
  const [dueDate, setDueDate] = useState(null); // due date value
  const inputRef = useRef(null); // reference to the input box

  // save tasks to localStorage every time tasks changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask() {
    if (input.trim() === "") return; // prevents adding empty tasks
    setTasks([...tasks, { text: input, completed: false, dueDate: dueDate ? dueDate.format("YYYY-MM-DD") : "" }]); // adds the new task
    setInput("");    // clears input box
    setDueDate(null);  // clears due date
    inputRef.current.focus(); // refocuses input box after adding task
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="app">
        <div className="card">
          <h1 className="title">To-Do</h1>

          {/* input row for adding new tasks */}
          <div className="input-row">
            <TextField
              inputRef={inputRef}
              variant="outlined"
              size="small"
              placeholder="Enter a task"
              value={input}
              onChange={(e) => setInput(e.target.value)} // updates input as user types
              onKeyDown={handleKeyDown} // allows pressing enter to add task
            />
            <DatePicker
              value={dueDate}
              onChange={(newDate) => setDueDate(newDate)} // updates due date as user picks
              slotProps={{ textField: { size: "small" } }}
            />
            <Button variant="contained" onClick={addTask}>Add</Button>
          </div>

          {/* list of tasks */}
          <ul className="list">
            {tasks.map((task, index) => (
              <li key={index} className="list-item">
                {/* shows task text, strikethrough if completed, red if overdue */}
                <span className={`task-text ${task.completed ? "completed" : ""} ${isOverdue(task.dueDate, task.completed) ? "overdue" : ""}`}>
                  {task.text}{task.dueDate ? ` - ${formatDate(task.dueDate)}` : ""}
                </span>

                {/* complete/undo button */}
                <IconButton onClick={() => toggleTask(index)} size="small">
                  {task.completed
                    ? <UndoIcon fontSize="small" titleAccess="Undo" />
                    : <CheckCircleOutlineIcon fontSize="small" titleAccess="Complete" />}
                </IconButton>

                {/* delete button */}
                <IconButton onClick={() => deleteTask(index)} size="small">
                  <DeleteIcon fontSize="small" titleAccess="Delete" />
                </IconButton>

              </li>
            ))}
          </ul>

        </div>
      </div>
    </LocalizationProvider>
  );
}

export default App;