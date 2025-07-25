const priorityScheduling = (processes) => {
    let completed = [];
    let remainingProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    let currentTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
  
    while (remainingProcesses.length > 0) {
      let availableProcesses = remainingProcesses.filter((p) => p.arrivalTime <= currentTime);
  
      if (availableProcesses.length === 0) {
        currentTime = remainingProcesses[0].arrivalTime;
        availableProcesses = [remainingProcesses[0]];
      }
  
      availableProcesses.sort((a, b) => a.priority - b.priority);
  
      let process = availableProcesses[0];
      let startTime = Math.max(currentTime, process.arrivalTime); 
      let endTime = startTime + process.burstTime; 
      let completionTime = endTime;
      let turnaroundTime = completionTime - process.arrivalTime;
      let waitingTime = turnaroundTime - process.burstTime;
  
      completed.push({
        id: process.id,
        arrivalTime: process.arrivalTime,
        burstTime: process.burstTime,
        priority: process.priority,
        startTime, 
        endTime,   
        completionTime,
        turnaroundTime,
        waitingTime,
      });
  
      totalWaitingTime += waitingTime;
      totalTurnaroundTime += turnaroundTime;
      currentTime = endTime;
  
      remainingProcesses = remainingProcesses.filter((p) => p.id !== process.id);
    }
  
    const avgWaitingTime = totalWaitingTime / processes.length;
    const avgTurnaroundTime = totalTurnaroundTime / processes.length;
    const throughput = processes.length / currentTime;
  
    return {
      algorithm: "Priority Scheduling",
      schedule: completed,
      avgWaitingTime,
      avgTurnaroundTime,
      throughput,
    };
  };
  
export default priorityScheduling;
