"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const applicants = [
  { id: 1, name: "Alice Johnson", role: "Senior Software Engineer", status: "New", avatar: "/placeholder.svg" },
  { id: 2, name: "Bob Smith", role: "Product Manager", status: "Interviewing", avatar: "/placeholder.svg" },
  { id: 3, name: "Charlie Brown", role: "UX Designer", status: "Rejected", avatar: "/placeholder.svg" },
  { id: 4, name: "Diana Ross", role: "Data Scientist", status: "Offered", avatar: "/placeholder.svg" },
]

export function Applicants() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent Applicants</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Applied For</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants.map((applicant) => (
            <TableRow key={applicant.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={applicant.avatar} alt={applicant.name} />
                    <AvatarFallback>
                      {applicant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span>{applicant.name}</span>
                </div>
              </TableCell>
              <TableCell>{applicant.role}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    applicant.status === "New"
                      ? "default"
                      : applicant.status === "Interviewing"
                        ? "secondary"
                        : applicant.status === "Rejected"
                          ? "destructive"
                          : "outline"
                  }
                >
                  {applicant.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost">View Profile</Button>
                <Button variant="ghost">Schedule Interview</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

