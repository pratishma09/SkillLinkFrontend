"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { ProjectForm } from "@/components/projects/ProjectForm"
import { useToast } from "@/hooks/use-toast"
import { JobPortalHeader } from "@/components/Home/JobPortalHeader"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const {id}=use(params);

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
      setProject(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
      router.push('/company/projects')
    } finally {
      setIsLoading(false)
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
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Project</h1>
      <ProjectForm initialData={project} isEditing />
    </div>
    </>
  )
} 