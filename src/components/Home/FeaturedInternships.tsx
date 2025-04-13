"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Building2, Tag, MapPin, DollarSign, CheckCircle2, Bookmark, BookmarkCheck } from "lucide-react"
import { motion } from "framer-motion"
import { Internship } from "./types"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface FeaturedInternshipsProps {
  internships: Internship[];
}

export function FeaturedInternships({ internships }: FeaturedInternshipsProps) {
  const { toast } = useToast()
  const [isApplying, setIsApplying] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [appliedProjects, setAppliedProjects] = useState<number[]>([])
  const [savedProjects, setSavedProjects] = useState<number[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        // Fetch applied projects
        const applicationsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-applications`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (applicationsResponse.ok) {
          const applicationsData = await applicationsResponse.json()
          const appliedIds = applicationsData.data.map((app: any) => app.project.id)
          setAppliedProjects(appliedIds)
        }

        // Fetch saved projects
        const savedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/saved-projects`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (savedResponse.ok) {
          const savedData = await savedResponse.json()
          const savedIds = savedData.data.map((app: any) => app.project.id)
          setSavedProjects(savedIds)
        }
      } catch (error) {
        console.error('Error fetching user projects:', error)
      }
    }

    fetchUserProjects()
  }, [])

  const handleApply = async (projectId: number) => {
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('userRole')

    // Check if user is authenticated and is a student
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please login to apply for this internship",
        variant: "destructive"
      })
      router.push('/login')
      return
    }

    if (userRole !== 'student') {
      toast({
        title: "Access Denied",
        description: "Only students can apply for internships",
        variant: "destructive"
      })
      return
    }

    try {
      setIsApplying(true)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/apply`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to apply')
      }

      // Add the project to applied projects
      setAppliedProjects(prev => [...prev, projectId])

      toast({
        title: "Success",
        description: "Application submitted successfully"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setIsApplying(false)
    }
  }

  const handleSave = async (projectId: number) => {
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('userRole')

    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please login to save this internship",
        variant: "destructive"
      })
      router.push('/login')
      return
    }

    if (userRole !== 'student') {
      toast({
        title: "Access Denied",
        description: "Only students can save internships",
        variant: "destructive"
      })
      return
    }

    try {
      setIsSaving(true)
      const isCurrentlySaved = savedProjects.includes(projectId)
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/${isCurrentlySaved ? 'unsave' : 'save'}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save project')
      }

      // Update saved projects list
      if (isCurrentlySaved) {
        setSavedProjects(prev => prev.filter(id => id !== projectId))
      } else {
        setSavedProjects(prev => [...prev, projectId])
      }

      toast({
        title: "Success",
        description: isCurrentlySaved ? "Project unsaved successfully" : "Project saved successfully"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleViewDetails = (projectId: number) => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please login to view project details",
        variant: "destructive"
      })
      router.push('/login')
      return
    }

    router.push(`/projects/${projectId}`)
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-8">Featured Internships</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.length > 0 ? (
            internships.map((internship) => (
              <motion.div
                key={internship.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow border border-gray-100">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{internship.title}</CardTitle>
                        <CardDescription className="text-base">{internship.company?.name}</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSave(internship.id)}
                        disabled={isSaving}
                        className="hover:bg-transparent"
                      >
                        {savedProjects.includes(internship.id) ? (
                          <BookmarkCheck className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Bookmark className="h-5 w-5 text-gray-400 hover:text-blue-600" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Tag className="w-4 h-4" />
                        <span>{internship.projectcategory?.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Briefcase className="w-4 h-4" />
                        <span>{internship.type_of_project}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{internship.location || 'Remote'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <DollarSign className="w-4 h-4" />
                        <span>{internship.salary || 'Negotiable'}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Deadline: {new Date(internship.deadline).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mt-6 space-y-2">
                      {appliedProjects.includes(internship.id) ? (
                        <Button 
                          disabled
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Applied
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleApply(internship.id)}
                          disabled={isApplying}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          {isApplying ? 'Applying...' : 'Apply Now'}
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleViewDetails(internship.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No internships found. Try adjusting your search.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}