"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const jobPostings = [
  { id: 1, title: "Senior Software Engineer", department: "Engineering", applicants: 24, status: "Active" },
  { id: 2, title: "Product Manager", department: "Product", applicants: 18, status: "Active" },
  { id: 3, title: "UX Designer", department: "Design", applicants: 12, status: "Closed" },
  { id: 4, title: "Data Scientist", department: "Data", applicants: 8, status: "Draft" },
]

export function JobPostings() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Job Postings</h3>
        <Button>Create New Job</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job Title</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Applicants</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobPostings.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">{job.title}</TableCell>
              <TableCell>{job.department}</TableCell>
              <TableCell>{job.applicants}</TableCell>
              <TableCell>
                <Badge
                  variant={job.status === "Active" ? "default" : job.status === "Closed" ? "secondary" : "outline"}
                >
                  {job.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost">Edit</Button>
                <Button variant="ghost">View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

