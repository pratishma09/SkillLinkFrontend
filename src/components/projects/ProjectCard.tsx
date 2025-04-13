"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Briefcase, MapPin, DollarSign, Tag } from "lucide-react"
import { formatDistanceToNow } from 'date-fns'

interface ProjectCardProps {
  project: {
    id: number
    title: string
    description: string
    type_of_project: string
    status: string
    skills_required: string[]
    deadline: string
    location: string
    salary: string
    projectcategory: {
      name: string
    }
    company: {
      name: string
    }
  }
  onViewDetails: (id: number) => void
}

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{project.title}</CardTitle>
            <CardDescription className="mt-2">{project.company?.name}</CardDescription>
          </div>
          <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{project.description}</p>
        <div className="flex gap-2 flex-wrap mb-4">
          {project.skills_required.map((skill, index) => (
            <Badge key={index} variant="outline">{skill}</Badge>
          ))}
        </div>
        <div className="flex flex-col gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            <span>{project.projectcategory?.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            <span>{project.type_of_project}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{project.location || 'Remote'}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>{project.salary || 'Negotiable'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Deadline: {formatDistanceToNow(new Date(project.deadline), { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onViewDetails(project.id)} className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
} 