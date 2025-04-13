"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ProjectCard } from "@/components/projects/ProjectCard"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { JobPortalHeader } from "@/components/Home/JobPortalHeader"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function CompanyProjectsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/my-projects`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (!response.ok) throw new Error('Failed to fetch projects')
      
      const data = await response.json()
      setProjects(data.data)
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

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <>
      <JobPortalHeader/>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Projects</h1>
          <Button onClick={() => router.push('/projects/create')}>
            Post New Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't posted any projects yet</p>
            <Button onClick={() => router.push('/projects/create')}>
              Create Your First Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="relative">
                <ProjectCard
                  project={project}
                  onViewDetails={(id) => router.push(`/projects/${id}`)}
                />
                <Button 
                  variant="outline" 
                  className="absolute top-4 right-4"
                  onClick={() => router.push(`/company/projects/${project.id}/applications`)}
                >
                  View Applications
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
} 