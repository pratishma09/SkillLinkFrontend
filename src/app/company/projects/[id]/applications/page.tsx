"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { JobPortalHeader } from "@/components/Home/JobPortalHeader"
import { ProjectApplicants } from "@/components/projects/ProjectApplicants"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { use } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function ProjectApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Unwrap the params promise
  const { id } = use(params)

  useEffect(() => {
    fetchProjectDetails()
  }, [id])

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/projects/${id}/applicants`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (!response.ok) throw new Error('Failed to fetch project details')
      
      const data = await response.json()
      setProject(data.data)
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

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Project not found</p>
      </div>
    )
  }

  return (
    <>
      <JobPortalHeader/>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Project Applications</h1>
          </div>
          <Button variant="outline" onClick={() => router.push('/company/projects')}>
            Back to Projects
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Applicants</h2>
            <div className="flex space-x-4">
              <Button 
                variant="outline"
                onClick={() => router.push(`/projects/${id}`)}
              >
                View Project
              </Button>
            </div>
          </div>
          
          <ProjectApplicants projectId={parseInt(id)} />
        </div>
      </div>
    </>
  )
} 