import React, { useState, useEffect } from "react";
import axios from "axios";
import ProcessForm from "@/components/ProcessForm";
import ProcessTable from "@/components/ProcessTable";
import ResultTable from "@/components/ResultTable";
import { Button } from "@/components/ui/button";
import GanttChart from "@/components/GanttChart";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const Home = () => {
  const [algorithm, setAlgorithm] = useState(() => localStorage.getItem("algorithm") || "");
  const [processList, setProcessList] = useState([]);
  const [timeQuantum, setTimeQuantum] = useState("");
  const [scheduleResult, setScheduleResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load stored data on component mount
  useEffect(() => {
    const storedProcesses = JSON.parse(localStorage.getItem("processList"));
    if (storedProcesses) setProcessList(storedProcesses);

    const storedAlgorithm = localStorage.getItem("algorithm");
    if (storedAlgorithm) setAlgorithm(storedAlgorithm);

    const storedTimeQuantum = localStorage.getItem("timeQuantum");
    if (storedTimeQuantum) setTimeQuantum(storedTimeQuantum);
  }, []);

  // Save process list, algorithm, and time quantum to LocalStorage
  useEffect(() => {
    localStorage.setItem("processList", JSON.stringify(processList));
  }, [processList]);

  useEffect(() => {
    localStorage.setItem("algorithm", algorithm);
  }, [algorithm]);

  useEffect(() => {
    localStorage.setItem("timeQuantum", timeQuantum);
  }, [timeQuantum]);

  // Function to send data to backend API
  const runScheduling = async () => {
    setIsLoading(true);
    if (!algorithm) {
      toast.error("Please select a scheduling algorithm.");
      setIsLoading(false);
      return;
    }
    if (processList.length === 0) {
      toast.error("Please add at least one process.");
      setIsLoading(false);
      return;
    }
    if (algorithm === "rr" && (!timeQuantum || timeQuantum <= 0)) {
      toast.error("Please enter a valid Time Quantum for Round Robin.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("https://cpu-simulator-x2gs.onrender.com/api/schedule", {
        algorithm,
        processes: processList,
        timeQuantum,
      });

      setScheduleResult(response.data);
      toast.success("Scheduling executed successfully!");
    } catch (error) {
      console.error("Error running scheduling:", error);
      toast.error("Failed to execute scheduling.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-[95%] sm:w-[90%] mx-auto mt-24 flex flex-col items-center gap-6">
        <div className="flex justify-between w-full flex-col lg:flex-row">
          <ProcessForm
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
            processList={processList}
            setProcessList={setProcessList}
            timeQuantum={timeQuantum}
            setTimeQuantum={setTimeQuantum}
          />

          <ProcessTable 
            processList={processList} 
            setProcessList={setProcessList} 
            algorithm={algorithm} 
            timeQuantum={timeQuantum} 
          />
        </div>

        {/* Run Scheduling Button with Loading Spinner */}
        <div className="w-full flex justify-center">
          <div className="w-[250px] flex justify-center">
            <Button 
              onClick={runScheduling} 
              className="w-1/2 min-w-[120px]" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg 
                    className="animate-spin h-5 w-5 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    ></circle>
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : (
                "Run Scheduling"
              )}
            </Button>
          </div>
        </div>

        {scheduleResult && (
          <>
            <ResultTable 
              scheduleResult={scheduleResult} 
              algorithm={algorithm} 
              timeQuantum={timeQuantum} 
            />
            <GanttChart 
              scheduleResult={scheduleResult} 
              algorithm={algorithm}
            />
          </>
        )}
      </div>
    </>
  );
};

export default Home;