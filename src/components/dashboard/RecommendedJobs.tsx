"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const recommendedJobs = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechFront",
    location: "Remote",
    salary: "$120,000 - $160,000",
    matchPercentage: 95,
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "StackMasters",
    location: "New York, NY",
    salary: "$100,000 - $140,000",
    matchPercentage: 90,
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "DesignPro",
    location: "San Francisco, CA",
    salary: "$90,000 - $130,000",
    matchPercentage: 85,
  },
  {
    id: 4,
    title: "Machine Learning Engineer",
    company: "AITech",
    location: "Boston, MA",
    salary: "$130,000 - $180,000",
    matchPercentage: 80,
  },
]

export function RecommendedJobs() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recommended Jobs</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendedJobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <Badge variant="secondary">{job.company}</Badge>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                <strong>Salary:</strong> {job.salary}
              </p>
              <p>
                <strong>Match:</strong> {job.matchPercentage}%
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Apply Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

