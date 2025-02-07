"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Building, DollarSign } from "lucide-react"

const featuredJobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechCorp",
    location: "San Francisco, CA",
    salary: "$120,000 - $160,000",
    type: "Full-time",
  },
  {
    id: 2,
    title: "Product Manager",
    company: "InnovateCo",
    location: "New York, NY",
    salary: "$100,000 - $130,000",
    type: "Full-time",
  },
  {
    id: 3,
    title: "UX Designer",
    company: "DesignHub",
    location: "Remote",
    salary: "$80,000 - $110,000",
    type: "Contract",
  },
  {
    id: 4,
    title: "Data Scientist",
    company: "DataDriven",
    location: "Boston, MA",
    salary: "$110,000 - $150,000",
    type: "Full-time",
  },
]

export function FeaturedJobs() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Jobs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredJobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <Badge variant="secondary">{job.type}</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Building className="mr-2 h-4 w-4" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span>{job.salary}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Apply Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Jobs
          </Button>
        </div>
      </div>
    </section>
  )
}

