import React, { useState } from "react";
import axios from "axios";
import ComparisonForm from "@/components/ComparisonForm";
import ComparisonProcessTable from "@/components/ComparisonProcessTable";
import ComparisonResults from "@/components/ComparisonResults";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import ComparisonChart from "./ComparisonChart";
import ProcessComparisonChart from "@/components/ProcessComparisonChart";

export default function Comparison() {
  const [selectedAlgorithms, setSelectedAlgorithms] = useState([]);
  const [comparisonProcesses, setComparisonProcesses] = useState([]);
  const [comparisonResults, setComparisonResults] = useState([]);
  const [timeQuantum, setTimeQuantum] = useState("");
  const [showPriorityDialog, setShowPriorityDialog] = useState(false);
  const [showTQDialog, setShowTQDialog] = useState(false);
  const [missingPriorityProcesses, setMissingPriorityProcesses] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const validateAndRunComparison = async () => {
    setIsLoading(true);
    if (selectedAlgorithms.length === 0) {
      toast.error("Please select at least one scheduling algorithm.");
      setIsLoading(false);
      return;
    }
    if (comparisonProcesses.length === 0) {
      toast.error("Please add at least one process for comparison.");
      setIsLoading(false);
      return;
    }

    if (selectedAlgorithms.includes("priority")) {
      const missingPriority = comparisonProcesses.filter((p) => p.priority === undefined);

      if (missingPriority.length > 0) {
        setMissingPriorityProcesses(missingPriority);
        setShowPriorityDialog(true);
        setIsLoading(false);
        return;
      }
    }

    if (selectedAlgorithms.includes("rr") && (!timeQuantum || timeQuantum <= 0)) {
      setShowTQDialog(true);
      setIsLoading(false);
      return;
    }

    await runComparison();
  };

  const runComparison = async () => {
    try {
      const response = await axios.post("https://cpu-simulator-x2gs.onrender.com/api/compare", {
        algorithms: selectedAlgorithms,
        processes: comparisonProcesses,
        timeQuantum: selectedAlgorithms.includes("rr") ? timeQuantum : undefined,
      });

      setComparisonResults(response.data);
      toast.success("Comparison executed successfully!");
    } catch (error) {
      console.error("Error running comparison:", error);
      toast.error("Failed to execute comparison.");
    } finally {
      setIsLoading(false);
    }
  };

  const removePriorityScheduling = () => {
    const updatedAlgorithms = selectedAlgorithms.filter((algo) => algo !== "priority");
    setSelectedAlgorithms(updatedAlgorithms);
    setShowPriorityDialog(false);
    toast.success("Priority Scheduling removed.");
  };

  const removeRoundRobin = () => {
    const updatedAlgorithms = selectedAlgorithms.filter((algo) => algo !== "rr");
    setSelectedAlgorithms(updatedAlgorithms);
    setShowTQDialog(false);
    toast.success("Round Robin removed.");
  };

  return (
    <div className="w-[90%] mx-auto flex flex-col items-center gap-6 mt-24">
      <div className="flex justify-between w-full flex-col lg:flex-row">
        <ComparisonForm
          selectedAlgorithms={selectedAlgorithms}
          setSelectedAlgorithms={setSelectedAlgorithms}
          comparisonProcesses={comparisonProcesses}
          setComparisonProcesses={setComparisonProcesses}
          timeQuantum={timeQuantum}
          setTimeQuantum={setTimeQuantum}
        />

        <ComparisonProcessTable
          processList={comparisonProcesses}
          setProcessList={setComparisonProcesses}
          selectedAlgorithms={selectedAlgorithms}
          timeQuantum={timeQuantum}
          setTimeQuantum={setTimeQuantum}
        />
      </div>

      <div className="w-full flex justify-center">
        <Button 
          onClick={validateAndRunComparison} 
          className="w-1/3 min-w-[200px]" 
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
            "Run Comparison"
          )}
        </Button>
      </div>

      {comparisonResults.length > 0 && (
        <>
          <ComparisonResults comparisonResults={comparisonResults} />
          <ProcessComparisonChart comparisonResults={comparisonResults} />
          <ComparisonChart comparisonResults={comparisonResults} />
        </>
      )}

      {/* Priority Conflict Dialog */}
      <Dialog open={showPriorityDialog} onOpenChange={setShowPriorityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Priority Conflict Detected</DialogTitle>
          </DialogHeader>
          <p className="text-gray-700">
            The following processes are missing a priority value:{" "}
            <span className="font-semibold">{missingPriorityProcesses.map((p) => p.id).join(", ")}</span>
          </p>
          <p className="text-gray-700">What would you like to do?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                toast.info("Please edit priority values manually.");
                setShowPriorityDialog(false);
              }}
            >
              Edit Manually
            </Button>
            <Button variant="destructive" onClick={removePriorityScheduling}>
              Remove Priority Scheduling
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Time Quantum Dialog */}
      <Dialog open={showTQDialog} onOpenChange={setShowTQDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Time Quantum Required</DialogTitle>
          </DialogHeader>
          <p className="text-gray-700">
            You have selected <b> Round Robin</b>, but no Time Quantum is set. Please enter a valid value.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTQDialog(false)}>
              Edit Manually
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                removeRoundRobin();
                setShowTQDialog(false);
              }}
            >
              Remove Round Robin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}