import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function ComparisonProcessTable({ 
  processList = [], 
  setProcessList, 
  selectedAlgorithms, 
  timeQuantum, 
  setTimeQuantum 
}) {
  const [editIndex, setEditIndex] = useState(null);
  const [editedProcess, setEditedProcess] = useState({});
  const [showPriorityDialog, setShowPriorityDialog] = useState(false);
  const [showTimeQuantumDialog, setShowTimeQuantumDialog] = useState(false);

  // Handle deletion of a process
  const handleDelete = (index) => {
    const updatedProcesses = processList.filter((_, i) => i !== index);
    setProcessList(updatedProcesses);
    toast.info("Process removed from comparison.");
  };

  // Handle edit initiation
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedProcess(processList[index]); // Set current row data in state
  };

  // Handle saving edited values
  const handleSave = (index) => {
    const updatedProcesses = [...processList];

    updatedProcesses[index] = {
      ...editedProcess,
      arrivalTime: Number(editedProcess.arrivalTime),
      burstTime: Number(editedProcess.burstTime),
      priority: editedProcess.priority ? Number(editedProcess.priority) : undefined,
    };

    setProcessList(updatedProcesses);
    setEditIndex(null);
    toast.success("Process updated!");
  };

  // Handle input changes
  const handleChange = (e, field) => {
    setEditedProcess((prev) => ({
      ...prev,
      [field]: field === "arrivalTime" || field === "burstTime" || field === "priority"
        ? Number(e.target.value)
        : e.target.value,
    }));
  };

  // 🔹 Check before submitting the comparison
  const validateBeforeCompare = () => {
    // If Priority Scheduling is selected, check if all processes have a priority value
    if (selectedAlgorithms.includes("priority")) {
      const hasPriorityIssues = processList.some(p => p.priority === undefined);
      if (hasPriorityIssues) {
        setShowPriorityDialog(true);
        return;
      }
    }

    // If Round Robin is selected, check if Time Quantum is provided
    if (selectedAlgorithms.includes("rr") && (!timeQuantum || timeQuantum <= 0)) {
      setShowTimeQuantumDialog(true);
      return;
    }

    toast.success("Validation passed! Ready to compare.");
  };

  return (
    <>
      {/* 🔹 Dialog for Priority Issues */}
      <Dialog open={showPriorityDialog} onOpenChange={setShowPriorityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Priority Values Missing</DialogTitle>
          </DialogHeader>
          <p className="text-gray-700">
            Some processes are missing priority values. Choose an action:
          </p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowPriorityDialog(false);
                setProcessList(processList.map(p => ({ ...p, priority: 1 })));
                toast.success("Default priority (1) set for all processes.");
              }}>
              Set Priority for All (Default 1)
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                setProcessList(processList.filter(p => p.priority !== undefined));
                setShowPriorityDialog(false);
                toast.success("Processes without priority removed.");
              }}>
              Remove Processes Without Priority
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 🔹 Dialog for Missing Time Quantum */}
      <Dialog open={showTimeQuantumDialog} onOpenChange={setShowTimeQuantumDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Time Quantum Required</DialogTitle>
          </DialogHeader>
          <p className="text-gray-700">
            Round Robin requires a Time Quantum value. Please enter a valid value.
          </p>
          <DialogFooter>
            <Button variant="default" onClick={() => setShowTimeQuantumDialog(false)}>
              Okay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/*  Process Table */}
      <Card className="w-full shadow-lg lg:w-[55%]">
        <CardHeader>
          <CardTitle>Processes for Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Arrival Time</TableHead>
                <TableHead>Burst Time</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processList.length > 0 ? (
                processList.map((process, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {editIndex === index ? (
                        <Input value={editedProcess.id} disabled className="w-16" />
                      ) : (
                        process.id
                      )}
                    </TableCell>
                    <TableCell>
                      {editIndex === index ? (
                        <Input
                          type="number"
                          value={editedProcess.arrivalTime}
                          onChange={(e) => handleChange(e, "arrivalTime")}
                          className="w-16"
                        />
                      ) : (
                        process.arrivalTime
                      )}
                    </TableCell>
                    <TableCell>
                      {editIndex === index ? (
                        <Input
                          type="number"
                          value={editedProcess.burstTime}
                          onChange={(e) => handleChange(e, "burstTime")}
                          className="w-16"
                        />
                      ) : (
                        process.burstTime
                      )}
                    </TableCell>
                    <TableCell>
                      {editIndex === index ? (
                        <Input
                          type="number"
                          value={editedProcess.priority || ""}
                          onChange={(e) => handleChange(e, "priority")}
                          className="w-16"
                        />
                      ) : (
                        process.priority || "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {editIndex === index ? (
                        <Button size="sm" variant="success" onClick={() => handleSave(index)}>
                          Save
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleEdit(index)}>
                          Edit
                        </Button>
                      )}
                      <Button size="sm" variant="destructive" className="ml-2" onClick={() => handleDelete(index)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="5" className="text-center text-gray-500">
                    No processes added for comparison.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Time Quantum Input for RR */}
          {selectedAlgorithms.includes("rr") && (
            <div className="mt-4">
              <p className="font-medium">Time Quantum for Round Robin</p>
              <Input
                type="number"
                value={timeQuantum}
                onChange={(e) => setTimeQuantum(Number(e.target.value))}
                placeholder="Enter Time Quantum (e.g., 4)"
                required
              />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
