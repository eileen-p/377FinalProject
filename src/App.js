import React, { useState } from "react";
import "./styles.css";

// Define the Process class
class Process {
  constructor(id, arrival, duration) {
    this.id = id;
    this.arrival = arrival;
    this.duration = duration;
    this.completion = 0;
    this.first_run = -1;
  }
}

// FIFO function
function fifo(workload) {
  const complete = [];
  const copy = [...workload];
  const readyQueue = [];
  let currProcess = null;
  let currTime = 0;

  while (copy.length > 0 || readyQueue.length > 0) {
    if (readyQueue.length === 0) {
      currTime = copy[0].arrival;
    }

    while (copy.length > 0 && copy[0].arrival <= currTime) {
      readyQueue.push(
        new Process(copy[0].id, copy[0].arrival, copy[0].duration)
      ); // Create a copy of the process
      copy.shift();
    }

    currProcess = readyQueue.shift();
    if (currProcess.first_run === -1) {
      currProcess.first_run = currTime;
    }
    currTime += currProcess.duration;
    currProcess.completion = currTime;
    complete.push(currProcess);
  }

  return complete;
}

// SJF function
function sjf(workload) {
  const complete = [];
  const copy = [...workload];
  const readyQueue = [];
  let currProcess = null;
  let currTime = 0;
  let processCounter = 0;

  while (copy.length > 0 || readyQueue.length > 0) {
    if (readyQueue.length === 0) {
      currTime = copy[0].arrival;
    }

    while (copy.length > 0 && copy[0].arrival <= currTime) {
      readyQueue.push(
        new Process(copy[0].id, copy[0].arrival, copy[0].duration)
      );
      copy.shift();
    }

    readyQueue.sort((a, b) => a.duration - b.duration);

    if (readyQueue.length > 0) {
      currProcess = readyQueue.shift();
      if (currProcess.first_run === -1) {
        currProcess.first_run = currTime;
      }
      currTime += currProcess.duration;
      currProcess.completion = currTime;
      complete.push(currProcess);
    } else if (copy.length > 0) {
      currTime = copy[0].arrival;
    }
  }

  return complete;
}

// Timeline Component
function Timeline({ processes }) {
  const sortedProcesses = [...processes].sort((a, b) => a.arrival - b.arrival);

  return (
    <div className="timeline">
      {sortedProcesses.map((process) => (
        <div
          key={process.id}
          className="timeline-item"
          style={{ width: `${process.duration * 10}px` }}
        >
          Process {process.id}
        </div>
      ))}
    </div>
  );
}

// App Component
function App() {
  const [processes, setProcesses] = useState([]);
  const [arrival, setArrival] = useState("");
  const [duration, setDuration] = useState("");
  const [completedProcesses, setCompletedProcesses] = useState([]);
  const [algorithm, setAlgorithm] = useState("FIFO"); // Default algorithm is FIFO

  // Add a new process
  const addProcess = () => {
    if (arrival && duration) {
      const id = processes.length + 1; // Generate a unique ID
      const process = new Process(id, parseInt(arrival), parseInt(duration));
      setProcesses((prevProcesses) => [...prevProcesses, process]);
      setArrival("");
      setDuration("");
    }
  };

  // Run scheduling algorithm on button click
  const runSchedulingAlgorithm = () => {
    let completed;
    if (algorithm === "FIFO") {
      completed = fifo(processes);
    } else if (algorithm === "SJF") {
      completed = sjf(processes);
    }
    setCompletedProcesses(completed);
  };

  // Function to handle algorithm selection
  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
    resetPage();
  };

  // Reset the page and clear the processes
  const resetPage = () => {
    setProcesses([]);
    setCompletedProcesses([]);
  };

  return (
    <div>
      <h1>{algorithm} Scheduling</h1>
      <div>
        <input
          type="text"
          placeholder="Arrival Time"
          value={arrival}
          onChange={(e) => setArrival(e.target.value)}
        />
        <input
          type="text"
          placeholder="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <button onClick={addProcess}>Add Process</button>
      </div>
      <div>
        <label htmlFor="algorithm">Select Algorithm:</label>
        <select
          id="algorithm"
          value={algorithm}
          onChange={handleAlgorithmChange}
        >
          <option value="FIFO">FIFO</option>
          <option value="SJF">Shortest Job First</option>
        </select>
      </div>
      <button onClick={runSchedulingAlgorithm}>Run Algorithm</button>
      {completedProcesses.length > 0 && (
        <div>
          <h2>Completed Processes</h2>
          <ul>
            {completedProcesses.map((process) => (
              <li key={process.id}>
                Process {process.id}: Arrival Time - {process.arrival}, Duration
                - {process.duration}, Completion Time - {process.completion}
              </li>
            ))}
          </ul>
        </div>
      )}
      {processes.length > 0 && (
        <div>
          <h2>Process List</h2>
          <ul>
            {processes.map((process) => (
              <li key={process.id}>
                Process {process.id}: Arrival Time - {process.arrival}, Duration
                - {process.duration}
              </li>
            ))}
          </ul>
        </div>
      )}
      {completedProcesses.length > 0 && (
        <div>
          <h2>Timeline</h2>
          <Timeline processes={completedProcesses} />
        </div>
      )}
    </div>
  );
}

export default App;
