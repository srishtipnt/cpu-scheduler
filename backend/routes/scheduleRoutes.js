import express from "express";
import fcfs from "../schedulingAlgorithms/fcfs.js";
import sjf from "../schedulingAlgorithms/sjf.js";
import priorityScheduling from "../schedulingAlgorithms/priority.js";
import roundRobin from "../schedulingAlgorithms/roundRobin.js";

const router = express.Router();

// Route: Run a Single Algorithm → POST /api/schedule
router.post("/", (req, res) => {
  const { algorithm, processes, timeQuantum } = req.body;

  if (!algorithm || !processes || !Array.isArray(processes)) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  let result;
  switch (algorithm.toLowerCase()) {
    case "fcfs":
      result = fcfs(processes);
      break;
    case "sjf":
      result = sjf(processes);
      break;
    case "priority":
      result = priorityScheduling(processes);
      break;
    case "rr":
      if (!timeQuantum || timeQuantum <= 0) {
        return res.status(400).json({ error: "Invalid time quantum for Round Robin" });
      }
      result = roundRobin(processes, timeQuantum);
      break;
    default:
      return res.status(400).json({ error: "Unknown scheduling algorithm" });
  }

  return res.json(result);
});

export default router;
