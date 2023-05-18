import React, { useState } from "react";
import "./styles.css";

// Define the Process class
class Process {
  constructor(arrival, duration) {
    this.arrival = arrival;
    this.duration = duration;
    this.completion = 0;
    this.first_run = -1;
  }
}

// SJF function
function sjf(workload) {
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
      readyQueue.push(new Process(copy[0].arrival, copy[0].duration)); // Create a copy of the process
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

// Timeline Component
function Timeline({ processes }) {
  const timelineItems = [];

  for (let i = 0; i < processes.length; i++) {
    const process = processes[i];
    timelineItems.push(
      <div
        key={i}
        className="timeline-item"
        style={{
          marginLeft: `${process.first_run * 10}px`,
          width: `${process.duration * 10}px`
        }}
      >
        Process {i + 1}
      </div>
    );
  }

  return <div className="timeline">{timelineItems}</div>;
}

// Process List Component
function ProcessList({ processes }) {
  return (
    <div>
      <h2>Process List</h2>
      <ul>
        {processes.map((process, index) => (
          <li key={index}>
            Process {index + 1}: Arrival Time - {process.arrival}, Duration -{" "}
            {process.duration}
          </li>
        ))}
      </ul>
    </div>
  );
}

// App Component
function App() {
  const [processes, setProcesses] = useState([]);
  const [arrival, setArrival] = useState("");
  const [duration, setDuration] = useState("");

  // Add a new process
  const addProcess = () => {
    if (arrival && duration) {
      const process = new Process(parseInt(arrival), parseInt(duration));
      setProcesses((prevProcesses) => [...prevProcesses, process]);
      setArrival("");
      setDuration("");
    }
  };

  // Run SJF on button click
  const runSJF = () => {
    const completedProcesses = sjf([...processes]); // Create a copy of the processes
    setProcesses(completedProcesses);
  };

  return (
    <div>
      <h1>SJF Scheduling</h1>
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
      <button onClick={runSJF}>Run SJF</button>
      {processes.length > 0 && (
        <div>
          <ProcessList processes={processes} />
          <Timeline processes={processes} />
        </div>
      )}
    </div>
  );
}

export default App;
