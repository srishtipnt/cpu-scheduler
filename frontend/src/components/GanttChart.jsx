import React, { useState, useEffect, useRef, useMemo } from "react";
import { scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { Bar } from "@visx/shape";
import { AxisBottom } from "@visx/axis";
import { Text } from "@visx/text";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const colors = ["#4CAF50", "#FF9800", "#2196F3", "#FF5722", "#9C27B0", "#3F51B5", "#00BCD4", "#FFEB3B"];
const getColor = (id) => colors[parseInt(id.replace(/\D/g, ""), 10) % colors.length];

const GanttChart = ({ scheduleResult, algorithm }) => {
  if (!scheduleResult) return <p className="text-gray-500">No scheduling results available.</p>;

  const allExecutions =
    algorithm.toLowerCase() === "rr" && scheduleResult.timeline ? scheduleResult.timeline : scheduleResult.schedule;

  if (!allExecutions || allExecutions.length === 0) {
    return <p className="text-gray-500">No Gantt Chart available.</p>;
  }

  const containerRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(800);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  const sortedAllExecutions = useMemo(() => {
    return [...allExecutions].sort((a, b) => a.startTime - b.startTime);
  }, [allExecutions]);

  const maxTime = useMemo(() => {
    return sortedAllExecutions.length > 0 ? Math.max(...sortedAllExecutions.map((p) => p.endTime)) : 0;
  }, [sortedAllExecutions]);

  const allIdlePeriods = useMemo(() => {
    const periods =[];
    let previousEnd = 0;
    for (const process of sortedAllExecutions) {
      if (process.startTime > previousEnd) {
        periods.push({ start: previousEnd, end: process.startTime });
      }
      previousEnd = Math.max(previousEnd, process.endTime);
    }
    return periods;
  }, [sortedAllExecutions]);

  useEffect(() => {
    if (containerRef.current) {
      setChartWidth(containerRef.current.clientWidth);
    }

    const handleResize = () => {
      if (containerRef.current) {
        setChartWidth(containerRef.current.clientWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  },);

  useEffect(() => {
    setCurrentIndex(0);
  }, [scheduleResult]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  },[]);

  const height = 80;
  const barHeight = 30;
  const padding = 50;

  const xScale = scaleLinear({
    domain: [0, maxTime],
    range: [padding, chartWidth - padding],
  });

  const handleStart = () => {
    if (isPlaying || currentIndex >= sortedAllExecutions.length) return;
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= sortedAllExecutions.length) {
          clearInterval(intervalRef.current);
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handlePause = () => {
    setIsPlaying(false);
    clearInterval(intervalRef.current);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (currentIndex >= sortedAllExecutions.length) {
      handlePause();
    }
  }, [currentIndex]);

  const displayedProcesses = sortedAllExecutions.slice(0, currentIndex);
  const currentTime = displayedProcesses.length > 0 ? displayedProcesses[displayedProcesses.length - 1].endTime : 0;

  const displayedIdlePeriods = useMemo(() => {
    return allIdlePeriods
      .map((period) => {
        if (period.end <= currentTime) {
          return period;
        } else if (period.start < currentTime) {
          return { start: period.start, end: currentTime };
        } else {
          return null;
        }
      })
      .filter((period) => period !== null);
  }, [allIdlePeriods, currentTime]);

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center mt-6 border-2 border-gray-200 rounded-lg shadow-lg p-4">
      <CardHeader className="!p-2">
        <CardTitle className="!text-left !p-0">Gantt Chart</CardTitle>
      </CardHeader>

      <div className="flex gap-2 mb-4">
        <Button
          onClick={handleStart}
          disabled={isPlaying || currentIndex >= sortedAllExecutions.length}
        >
          {isPlaying ? "Resuming..." : currentIndex === 0 ? "Start" : "Resume"}
        </Button>
        <Button onClick={handlePause} disabled={!isPlaying}>
          Pause
        </Button>
        <Button onClick={handleReset} disabled={currentIndex === 0}>
          Reset
        </Button>
      </div>

      <svg width={chartWidth} height={height + 50}>
        <defs>
          <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="8" height="8">
            <rect width="8" height="8" fill="#f0f0f0" />
            <path d="M0,0 L8,8" stroke="#999" strokeWidth="1" />
          </pattern>
        </defs>
        <Group top={30}>
          {displayedIdlePeriods.map((period, index) => {
            const barX = xScale(period.start);
            const barWidth = xScale(period.end) - barX;
            return (
              <motion.rect
                key={`idle-${index}`}
                x={barX}
                y={40}
                height={barHeight}
                fill="url(#diagonalHatch)"
                stroke="#ccc"
                strokeWidth={0.5}
                initial={{ width: 0 }}
                animate={{ width: barWidth }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            );
          })}
          {displayedProcesses.map((process, index) => {
            if (!process || process.startTime === undefined || process.endTime === undefined) return null;

            const barX = xScale(process.startTime);
            const barWidth = xScale(process.endTime) - barX;
            return (
              <Group key={`${process.id}-${index}`}>
                <motion.rect
                  x={barX}
                  y={40}
                  height={barHeight}
                  fill={getColor(process.id)}
                  stroke="#333"
                  initial={{ width: 0 }}
                  animate={{ width: barWidth }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                <Text x={barX + barWidth / 2} y={55} dy=".35em" fontSize={14} textAnchor="middle" fill="#fff">
                  {process.id}
                </Text>
              </Group>
            );
          })}
          <AxisBottom
            scale={xScale}
            top={barHeight + 50}
            stroke="black"
            tickStroke="black"
            tickLabelProps={() => ({
              fill: "black",
              fontSize: 12,
              textAnchor: "middle",
            })}
          />
        </Group>
      </svg>
    </div>
  );
};

export default GanttChart;