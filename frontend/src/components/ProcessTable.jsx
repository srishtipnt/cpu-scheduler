import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ProcessTable({ processList = [], setProcessList, algorithm = "", timeQuantum }) {
  const [editIndex, setEditIndex] = useState(null);
  const [editedProcess, setEditedProcess] = useState({});

  const handleDelete = (index) => {
    const updatedProcesses = processList.filter((_, i) => i !== index);
    setProcessList(updatedProcesses);
    toast.info("Process deleted!");
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedProcess(processList[index]); // Set current row data in state
  };

  const handleSave = (index) => {
    const updatedProcesses = [...processList];

    updatedProcesses[index] = {
      ...editedProcess,
      arrivalTime: Number(editedProcess.arrivalTime), //  Convert to number
      burstTime: Number(editedProcess.burstTime), //  Convert to number
      priority: algorithm === "priority" ? Number(editedProcess.priority) : undefined, //  Convert to number (if applicable)
    };

    setProcessList(updatedProcesses);
    setEditIndex(null);
    toast.success("Process updated!");
  };

  const handleChange = (e, field) => {
    setEditedProcess((prev) => ({
      ...prev,
      [field]: field === "arrivalTime" || field === "burstTime" || field === "priority" 
        ? Number(e.target.value) 
        : e.target.value, //  Convert to number
    }));
  };

  return (
    <Card className="max-full shadow-lg lg:w-[55%]">
      <CardHeader>
        <CardTitle>Process List ({algorithm ? algorithm.toUpperCase() : "Select Algorithm"})</CardTitle>
      </CardHeader>
      <CardContent className="!p-3 !md:p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Arrival Time</TableHead>
              <TableHead>Burst Time</TableHead>
              {algorithm === "priority" && <TableHead>Priority</TableHead>}
              {algorithm === "rr" && <TableHead>Time Quantum</TableHead>}
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
                  {algorithm === "priority" && (
                    <TableCell>
                      {editIndex === index ? (
                        <Input
                          type="number"
                          value={editedProcess.priority}
                          onChange={(e) => handleChange(e, "priority")}
                          className="w-16"
                        />
                      ) : (
                        process.priority
                      )}
                    </TableCell>
                  )}
                  {algorithm === "rr" && <TableCell>{timeQuantum}</TableCell>}
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
                  No processes added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
