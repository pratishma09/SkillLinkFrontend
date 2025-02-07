"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const applications = [
  { id: 1, jobTitle: "Senior Software Engineer", company: "TechCorp", appliedDate: "2023-06-15", status: "In Review" },
  {
    id: 2,
    jobTitle: "Product Manager",
    company: "InnovateCo",
    appliedDate: "2023-06-10",
    status: "Interview Scheduled",
  },
  { id: 3, jobTitle: "UX Designer", company: "DesignHub", appliedDate: "2023-06-05", status: "Rejected" },
  { id: 4, jobTitle: "Data Scientist", company: "DataDriven", appliedDate: "2023-06-01", status: "Pending" },
]

export function JobApplications() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Job Applications</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell className="font-medium">{application.jobTitle}</TableCell>
              <TableCell>{application.company}</TableCell>
              <TableCell>{application.appliedDate}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    application.status === "In Review"
                      ? "default"
                      : application.status === "Interview Scheduled"
                        ? "outline"
                        : application.status === "Rejected"
                          ? "destructive"
                          : "secondary"
                  }
                >
                  {application.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost">View Details</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

