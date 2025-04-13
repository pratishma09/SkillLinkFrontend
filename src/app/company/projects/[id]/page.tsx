"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Briefcase, Building, Calendar, MapPin, DollarSign, Tag } from "lucide-react"
import { format } from "date-fns"
import { JobPortalHeader } from "@/components/Home/JobPortalHeader"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const userRole = localStorage.getItem('userRole')
  const userId = localStorage.getItem('userId')
  const { id }=use(params);
  const userName = localStorage.getItem('userName')

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (!response.ok) throw new Error('Failed to fetch project details')
      
      const data = await response.json()
      console.log(data)
      setProject(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) throw new Error('Failed to delete project')

      toast({
        title: "Success",
        description: "Project deleted successfully"
      })

      router.push('/projects')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!project) {
    return <div className="text-center py-8">Project not found</div>
  }

  return (
    <>
        <JobPortalHeader/>
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{project.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2 text-gray-500">
                <Building className="h-4 w-4" />
                <span>{project.company.name}</span>
              </div>
            </div>
            <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
              {project.status}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
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
              <span>Posted {format(new Date(project.created_at), 'PPP')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Deadline: {format(new Date(project.deadline), 'PPP')}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{project.description}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Requirements</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {project.requirements.map((req: string, index: number) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {project.skills_required.map((skill: string, index: number) => (
                <Badge key={index} variant="outline">{skill}</Badge>
              ))}
            </div>
          </div>
          {userRole === 'company' && (
            <div className="flex gap-4 pt-4">
              <Button onClick={() => router.push(`/company/projects/${id}/edit`)}>
                Edit Project
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete Project
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  )
} 