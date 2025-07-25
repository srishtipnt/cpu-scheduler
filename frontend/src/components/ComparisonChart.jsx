import { ResponsiveBar } from "@nivo/bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ComparisonChart({ comparisonResults }) {
  if (!comparisonResults || comparisonResults.length === 0) {
    return null; // No chart if no data
  }

  const mainChartData = comparisonResults.map(({ algorithm, result }) => ({
    algorithm: algorithm.toUpperCase(),
    "Avg Waiting Time": result.avgWaitingTime,
    "Avg Turnaround Time": result.avgTurnaroundTime,
    "Completion Time": Math.max(...result.schedule.map((p) => p.completionTime), 0),
  }));

  const secondaryChartData = comparisonResults.map(({ algorithm, result }) => ({
    algorithm: algorithm.toUpperCase(),
    "Throughput": parseFloat((result.throughput * 100).toFixed(2)),  
    "CPU Utilization": parseFloat((((result.schedule.reduce((sum, p) => sum + p.burstTime, 0)) /
      Math.max(...result.schedule.map((p) => p.completionTime), 1)) * 100).toFixed(2)),  
  }));
  

  return (
    <div className="w-full flex flex-col gap-6">
      {/*  Main Chart (Avg Waiting Time, TAT, Completion Time) */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Algorithm Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent style={{ height: 400 }}>
          <ResponsiveBar
            data={mainChartData}
            keys={["Avg Waiting Time", "Avg Turnaround Time", "Completion Time"]}
            indexBy="algorithm"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            groupMode="grouped"
            colors={["#6a9cfc", "#ff8c8c", "#ffa726"]} // Light blue, soft red, orange
            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Algorithm",
              legendPosition: "middle",
              legendOffset: 32,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Metric Value",
              legendPosition: "middle",
              legendOffset: -40,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            legends={[
              {
                dataFrom: "keys",
                anchor: "bottom-right",
                direction: "column",
                translateX: 120,
                itemWidth: 120,
                itemHeight: 20,
                itemsSpacing: 2,
                symbolSize: 20,
                itemDirection: "left-to-right",
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Secondary Chart (CPU Utilization & Throughput) */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>CPU Utilization & Throughput Comparison</CardTitle>
        </CardHeader>
        <CardContent style={{ height: 400 }}>
          <ResponsiveBar
            data={secondaryChartData}
            keys={["CPU Utilization", "Throughput"]}
            indexBy="algorithm"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            groupMode="grouped"
            colors={["#b3e5fc", "#ffd54f"]} 
            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Algorithm",
              legendPosition: "middle",
              legendOffset: 32,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Metric Value (%)",
              legendPosition: "middle",
              legendOffset: -40,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            legends={[
              {
                dataFrom: "keys",
                anchor: "bottom-right",
                direction: "column",
                translateX: 120,
                itemWidth: 120,
                itemHeight: 20,
                itemsSpacing: 2,
                symbolSize: 20,
                itemDirection: "left-to-right",
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
