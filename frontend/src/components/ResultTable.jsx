import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ResultTable({ scheduleResult, algorithm, timeQuantum }) {
  if (!scheduleResult || !scheduleResult.schedule || scheduleResult.schedule.length === 0) {
    return (
      <Card className="w-full mt-6 shadow-lg">
        <CardHeader>
          <CardTitle>Scheduling Results</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-600">
          No scheduling results available. Run scheduling to view results.
        </CardContent>
      </Card>
    );
  }

  //  Convert schedule data to numeric values to avoid "string vs. number" issues.
  const schedule = scheduleResult.schedule.map((p) => ({
    ...p,
    arrivalTime: Number(p.arrivalTime),
    burstTime: Number(p.burstTime),
    waitingTime: Number(p.waitingTime),
    turnaroundTime: Number(p.turnaroundTime),
    completionTime: Number(p.completionTime),
  }));

  // Compute CPU Utilization using consistent, purely simulated values.
  const totalExecutionTime = schedule.reduce((sum, p) => sum + p.burstTime, 0);
  const totalTime = Math.max(...schedule.map((p) => p.completionTime), 1); // avoid division by zero
  const cpuUtilization = (totalExecutionTime / totalTime) * 100;

  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardHeader>
        {/* If you want to show the chosen algorithm, you can do so here */}
        <CardTitle>Scheduling Results ({scheduleResult.algorithm})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Arrival Time</TableHead>
              <TableHead>Burst Time</TableHead>
              {algorithm === "priority" && <TableHead>Priority</TableHead>}
              {algorithm === "rr" && <TableHead>Time Quantum</TableHead>}
              <TableHead>Waiting Time</TableHead>
              <TableHead>Turnaround Time</TableHead>
              <TableHead>Completion Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedule.map((process, index) => (
              <TableRow key={index}>
                <TableCell>{process.id}</TableCell>
                <TableCell>{process.arrivalTime}</TableCell>
                <TableCell>{process.burstTime}</TableCell>
                {algorithm === "priority" && <TableCell>{process.priority}</TableCell>}
                {algorithm === "rr" && <TableCell>{timeQuantum}</TableCell>}
                <TableCell>{process.waitingTime}</TableCell>
                <TableCell>{process.turnaroundTime}</TableCell>
                <TableCell>{process.completionTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Summary Metrics with CPU Utilization */}
        <div className="mt-6 rounded-lg border-2 p-4 text-gray-800">
          <h3 className="font-semibold mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-lg">
            <div className="text-center">
              <p className="font-medium text-gray-700">Avg Waiting Time</p>
              <p className="text-sm text-blue-600">
                {scheduleResult.avgWaitingTime.toFixed(2)} ms
              </p>
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-700">Avg Turnaround Time</p>
              <p className="text-sm text-green-600">
                {scheduleResult.avgTurnaroundTime.toFixed(2)} ms
              </p>
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-700">Throughput</p>
              <p className="text-sm text-red-600">
                {scheduleResult.throughput.toFixed(2)} processes/unit time
              </p>
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-700">CPU Utilization</p>
              <p className="text-sm text-purple-600">{cpuUtilization.toFixed(2)}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
