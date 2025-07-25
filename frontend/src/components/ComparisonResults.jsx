import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ComparisonResults({ comparisonResults }) {
  if (!comparisonResults || comparisonResults.length === 0) {
    return (
      <Card className="w-full mt-6 shadow-lg">
        <CardHeader>
          <CardTitle>Algorithm Comparison Results</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-600">
          No comparison results available. Please run comparison to view results.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardHeader>
        <CardTitle>Algorithm Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Table Comparing Performance Metrics */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Algorithm</TableHead>
              <TableHead>Avg Waiting Time</TableHead>
              <TableHead>Avg Turnaround Time</TableHead>
              <TableHead>Throughput</TableHead>
              <TableHead>CPU Utilization</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisonResults.map((result, index) => {
              const { algorithm, result: data } = result; // Extract `result` data correctly

              if (!data || !data.schedule) return null; // Prevent undefined errors

              // Compute CPU Utilization
              const totalExecutionTime = data.schedule.reduce((sum, p) => sum + p.burstTime, 0);
              const totalTime = Math.max(...data.schedule.map((p) => p.completionTime), 1); // Avoid division by zero
              const cpuUtilization = (totalExecutionTime / totalTime) * 100;

              return (
                <TableRow key={index}>
                  <TableCell>{algorithm.toUpperCase()}</TableCell>
                  <TableCell>{data.avgWaitingTime.toFixed(2)} ms</TableCell>
                  <TableCell>{data.avgTurnaroundTime.toFixed(2)} ms</TableCell>
                  <TableCell>{data.throughput.toFixed(2)}</TableCell>
                  <TableCell>{cpuUtilization.toFixed(2)}%</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
