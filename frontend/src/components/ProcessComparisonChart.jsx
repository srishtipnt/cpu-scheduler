import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ProcessComparisonChart = ({ comparisonResults }) => {
  if (!comparisonResults || comparisonResults.length === 0) {
    return null; 
  }

 
  const processData = {};
  comparisonResults.forEach(({ algorithm, result }) => {
    const algorithmName = algorithm.toUpperCase(); 
    result.schedule.forEach((process) => {
      if (!processData[process.id]) {
        processData[process.id] = { id: process.id };
      }
      processData[process.id][`${algorithmName} - WT`] = process.waitingTime;
      processData[process.id][`${algorithmName} - TAT`] = process.turnaroundTime;
      processData[process.id][`${algorithmName} - CT`] = process.completionTime;
    });
  });

  const chartData = Object.values(processData);

  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardHeader>
        <CardTitle>Process Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: 400 }}>
          <ResponsiveBar
            data={chartData}
            keys={comparisonResults.flatMap(({ algorithm }) => {
              const algorithmName = algorithm.toUpperCase(); 
              return [`${algorithmName} - WT`, `${algorithmName} - TAT`, `${algorithmName} - CT`];
            })}
            indexBy="id"
            margin={{ top: 20, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            colors={{ scheme: "set2" }}
            groupMode="grouped" 
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Processes",
              legendPosition: "middle",
              legendOffset: 40,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Time (ms)",
              legendPosition: "middle",
              legendOffset: -50,
            }}
            enableLabel={true}
            legends={[
              {
                dataFrom: "keys",
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 120,
                itemWidth: 100,
                itemHeight: 20,
                itemsSpacing: 2,
                symbolSize: 15,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
            tooltip={({ id, value, indexValue }) => (
              <span className="text-sm">
                {id}: {value} ms (Process {indexValue})
              </span>
            )}
            animate={true}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessComparisonChart;
