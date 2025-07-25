const roundRobin = (processes, timeQuantum) => {
    const originalBurst = {};
    processes.forEach((p) => {
      originalBurst[p.id] = p.burstTime;
    });

    const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    const readyQueue = [];
    const completionTimes = {};
    const timeline = [];

    let currentTime = 0;
    let i = 0; 

    while (i < sorted.length || readyQueue.length > 0) {
      if (readyQueue.length === 0) {
        if (currentTime < sorted[i].arrivalTime) {
          currentTime = sorted[i].arrivalTime;
        }
        readyQueue.push({ ...sorted[i] });
        i++;
      }

      let process = readyQueue.shift();
      let startTime = currentTime; 
      let execTime = Math.min(timeQuantum, process.burstTime);
      let endTime = startTime + execTime; 

      timeline.push({ id: process.id, startTime, endTime });

      currentTime = endTime;
      process.burstTime -= execTime;

      
      while (i < sorted.length && sorted[i].arrivalTime <= currentTime) {
        readyQueue.push({ ...sorted[i] });
        i++;
      }

      if (process.burstTime > 0) {
        readyQueue.push(process);
      } else {
        completionTimes[process.id] = currentTime;
      }
    }

    let totalWaiting = 0;
    let totalTurnaround = 0;
    let schedule = processes.map((p) => {
      let ct = completionTimes[p.id];
      let tat = ct - p.arrivalTime;
      let wt = tat - originalBurst[p.id];
      totalWaiting += wt;
      totalTurnaround += tat;
      return {
        id: p.id,
        arrivalTime: p.arrivalTime,
        burstTime: originalBurst[p.id],
        startTime: timeline.find((t) => t.id === p.id)?.startTime || 0, 
        endTime: timeline.find((t) => t.id === p.id)?.endTime || ct, 
        completionTime: ct,
        turnaroundTime: tat,
        waitingTime: wt,
      };
    });

    let avgWaitingTime = totalWaiting / processes.length;
    let avgTurnaroundTime = totalTurnaround / processes.length;
    let throughput = processes.length / currentTime;

    return {
      algorithm: "Round Robin",
      timeline,
      schedule,
      avgWaitingTime,
      avgTurnaroundTime,
      throughput,
    };
  };

export default roundRobin;
