import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function ComparisonForm({ 
  selectedAlgorithms, 
  setSelectedAlgorithms, 
  comparisonProcesses, 
  setComparisonProcesses, 
  timeQuantum, 
  setTimeQuantum 
}) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      processId: "",
      arrivalTime: "",
      burstTime: "",
      priority: "",
    },
  });

  const [showPriorityDialog, setShowPriorityDialog] = useState(false);
  const [priorityConflict, setPriorityConflict] = useState(false);

  
  useEffect(() => {
    const storedProcesses = JSON.parse(localStorage.getItem("comparisonProcesses")) || [];
    const storedAlgorithms = JSON.parse(localStorage.getItem("selectedAlgorithms")) || [];
    const storedTimeQuantum = localStorage.getItem("timeQuantum") || "";

    setComparisonProcesses(storedProcesses);
    setSelectedAlgorithms(storedAlgorithms);
    setTimeQuantum(storedTimeQuantum);
  }, []);

  
  useEffect(() => {
    localStorage.setItem("comparisonProcesses", JSON.stringify(comparisonProcesses));
  }, [comparisonProcesses]);

  useEffect(() => {
    localStorage.setItem("selectedAlgorithms", JSON.stringify(selectedAlgorithms));
  }, [selectedAlgorithms]);

  useEffect(() => {
    localStorage.setItem("timeQuantum", timeQuantum);
  }, [timeQuantum]);

  
  const handleAlgorithmChange = (algorithm) => {
    let updatedAlgorithms = [...selectedAlgorithms];

    if (updatedAlgorithms.includes(algorithm)) {
      updatedAlgorithms = updatedAlgorithms.filter((algo) => algo !== algorithm);
    } else {
      updatedAlgorithms.push(algorithm);
    }

    setSelectedAlgorithms(updatedAlgorithms);
    toast.success("Algorithms updated for comparison!");
  };

  
  const checkDuplicateProcessId = (id) =>
    comparisonProcesses.some((process) => process.id.toLowerCase() === id.toLowerCase());

  
  const onSubmit = (data) => {
    if (checkDuplicateProcessId(data.processId)) {
      toast.error("Process ID must be unique!");
      return;
    }

    if (data.arrivalTime < 0 || data.burstTime < 1) {
      toast.error("Arrival time cannot be negative & Burst time must be at least 1.");
      return;
    }

    
    if (selectedAlgorithms.includes("priority")) {
      const hasPriorityValues = comparisonProcesses.some((p) => p.priority !== undefined);
      const missingPriorityValues = comparisonProcesses.some((p) => p.priority === undefined);

      if (hasPriorityValues && missingPriorityValues) {
        setPriorityConflict(true);
        setShowPriorityDialog(true);
        return;
      }
    }

    
    if (selectedAlgorithms.includes("rr") && (!timeQuantum || timeQuantum <= 0)) {
      toast.error("Please enter a valid Time Quantum for Round Robin.");
      return;
    }

    
    const newProcess = {
      id: data.processId,
      arrivalTime: parseInt(data.arrivalTime),
      burstTime: parseInt(data.burstTime),
      priority: data.priority ? parseInt(data.priority) : undefined,
    };

    setComparisonProcesses([...comparisonProcesses, newProcess]);
    toast.success(`Process ${data.processId} added successfully!`);
    reset();
  };

  
  const resolvePriorityConflict = (action) => {
    if (action === "set_all") {
      toast.info("Please enter priority values for all processes in the table.");
    } else if (action === "remove_one") {
      const updatedProcesses = comparisonProcesses.map((p) => ({
        ...p,
        priority: undefined, // Remove priority from all processes
      }));
      setComparisonProcesses(updatedProcesses);
      toast.success("Priority removed from all processes.");
    }
    setPriorityConflict(false);
    setShowPriorityDialog(false);
  };

  return (
    <>
      <div className="w-full lg:w-[40%] mb-8 lg:mb-0">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>CPU Scheduling Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <Label className="font-medium">Select Scheduling Algorithms</Label>
            <div className="flex flex-wrap gap-3 mt-2">
              {["fcfs", "sjf", "priority", "rr"].map((algo) => (
                <div key={algo} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedAlgorithms.includes(algo)}
                    onCheckedChange={() => handleAlgorithmChange(algo)}
                  />
                  <Label>{algo.toUpperCase()}</Label>
                </div>
              ))}
            </div>

            
            <div className="mt-4">
              <Label>Time Quantum (for RR)</Label>
              <Input
                type="number"
                value={timeQuantum}
                onChange={(e) => setTimeQuantum(e.target.value)}
                placeholder="Enter Time Quantum (e.g., 4)"
              />
            </div>
          </CardContent>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Label>Process ID</Label>
              <Input className="!mt-0 !mb-4" {...register("processId")} placeholder="Enter a unique process ID (e.g., P1, P2)" required />

              <Label>Arrival Time</Label>
              <Input className="!mt-0 !mb-4" type="number" {...register("arrivalTime")} placeholder="Enter arrival time (e.g., 0, 5, 10)" required />

              <Label>Burst Time</Label>
              <Input className="!mt-0 !mb-4" type="number" {...register("burstTime")} placeholder="Enter burst time (e.g., 3, 8, 12)" required />

              
              <Label>Priority (for Priority Scheduling)</Label>
              <Input className="!mt-0 !mb-4" type="number" {...register("priority")} placeholder="Enter priority (1 = highest, 10 = lowest)" />

              <Button type="submit" className="w-full">
                Add Process for Comparison
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      
      <Dialog open={showPriorityDialog} onOpenChange={setShowPriorityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Priority Conflict Detected</DialogTitle>
          </DialogHeader>
          <p className="text-gray-700">
            Some processes have a priority value while others do not. What would you like to do?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => resolvePriorityConflict("set_all")}>
              Set Priority for All
            </Button>
            <Button variant="destructive" onClick={() => resolvePriorityConflict("remove_one")}>
              Remove Priority from All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
