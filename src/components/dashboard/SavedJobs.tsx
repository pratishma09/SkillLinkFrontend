"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const savedJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "WebTech",
    location: "Remote",
    salary: "$80,000 - $120,000",
    postedDate: "2023-06-10",
  },
  {
    id: 2,
    title: "DevOps Engineer",
    company: "CloudSys",
    location: "New York, NY",
    salary: "$100,000 - $150,000",
    postedDate: "2023-06-08",
  },
  {
    id: 3,
    title: "Marketing Manager",
    company: "BrandBoost",
    location: "Los Angeles, CA",
    salary: "$70,000 - $100,000",
    postedDate: "2023-06-05",
  },
  {
    id: 4,
    title: "AI Research Scientist",
    company: "AIInnovate",
    location: "San Francisco, CA",
    salary: "$130,000 - $180,000",
    postedDate: "2023-06-01",
  },
]

export function SavedJobs() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Saved Jobs</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Salary Range</TableHead>
            <TableHead>Posted Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {savedJobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">{job.title}</TableCell>
              <TableCell>{job.company}</TableCell>
              <TableCell>{job.location}</TableCell>
              <TableCell>{job.salary}</TableCell>
              <TableCell>{job.postedDate}</TableCell>
              <TableCell>
                <Button variant="outline" className="mr-2">
                  Apply
                </Button>
                <Button variant="ghost">Remove</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

