const fcfs = (processes) => {
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
    let currentTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    let result = [];
  
    processes.forEach((process) => {
      let startTime = Math.max(currentTime, process.arrivalTime); 
      let endTime = startTime + process.burstTime; 
      let completionTime = endTime;
      let turnaroundTime = completionTime - process.arrivalTime;
      let waitingTime = turnaroundTime - process.burstTime;
  
      result.push({
        id: process.id,
        arrivalTime: process.arrivalTime,
        burstTime: process.burstTime,
        startTime, 
        endTime,   
        completionTime,
        turnaroundTime,
        waitingTime,
      });
  
      totalWaitingTime += waitingTime;
      totalTurnaroundTime += turnaroundTime;
      currentTime = endTime;
    });
  
    const avgWaitingTime = totalWaitingTime / processes.length;
    const avgTurnaroundTime = totalTurnaroundTime / processes.length;
    const throughput = processes.length / currentTime;
  
    return { 
      algorithm: "FCFS", 
      schedule: result, 
      avgWaitingTime, 
      avgTurnaroundTime, 
      throughput 
    };
  };
  
export default fcfs;
