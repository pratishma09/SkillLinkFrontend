"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Building2, Tag, MapPin, DollarSign, Bookmark, BookmarkCheck, Calendar, Clock, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { JobPortalFooter } from "@/components/Home/JobPortalFooter"
import { JobPortalHeader } from "@/components/Home/JobPortalHeader"

interface Project {
  id: number;
  title: string;
  description: string;
  type_of_project: string;
  location: string;
  salary: string;
  deadline: string;
  company: {
    name: string;
  };
  projectcategory: {
    name: string;
  };
}

interface Application {
  id: number;
  project: Project;
  jobseeker_status: string;
  applied_date: string;
  meeting_time: string | null;
}

export default function MyProjectsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [savedProjects, setSavedProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isApplying, setIsApplying] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          toast({
            title: "Authentication Required",
            description: "Please login to view your projects",
            variant: "destructive"
          })
          router.push('/login')
          return
        }

        // Fetch applications
        const applicationsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-applications`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (applicationsResponse.ok) {
          const applicationsData = await applicationsResponse.json()
          setApplications(applicationsData.data)
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
          setSavedProjects(savedData.data.map((app: any) => app.project))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: "Error",
          description: "Failed to fetch your projects",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router, toast])

  const handleApply = async (projectId: number) => {
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('userRole')

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

      // Update applications list
      const newApplication = {
        id: data.application.id,
        project: data.application.project,
        jobseeker_status: 'applied',
        applied_date: new Date().toISOString(),
        meeting_time: null
      }
      setApplications(prev => [...prev, newApplication])

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

  const handleViewDetails = (projectId: number) => {
    router.push(`/company/projects/${projectId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'bg-blue-100 text-blue-800'
      case 'interview':
        return 'bg-purple-100 text-purple-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isProjectApplied = (projectId: number) => {
    return applications.some(app => app.project.id === projectId)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <>
    <JobPortalHeader/>
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">My Projects</h1>
      
      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="saved">Saved Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.length > 0 ? (
              applications.map((application) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow border border-gray-100">
                    <CardHeader>
                      <CardTitle className="text-xl">{application.project.title}</CardTitle>
                      <CardDescription className="text-base">{application.project.company.name}</CardDescription>
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(application.jobseeker_status)}`}>
                        {application.jobseeker_status}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Tag className="w-4 h-4" />
                          <span>{application.project.projectcategory.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Briefcase className="w-4 h-4" />
                          <span>{application.project.type_of_project}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>{application.project.location || 'Remote'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <DollarSign className="w-4 h-4" />
                          <span>{application.project.salary || 'Negotiable'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>Applied: {new Date(application.applied_date).toLocaleDateString()}</span>
                        </div>
                        {application.meeting_time && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>Meeting: {new Date(application.meeting_time).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full mt-6"
                        onClick={() => handleViewDetails(application.project.id)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No applications found.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProjects.length > 0 ? (
              savedProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow border border-gray-100">
                    <CardHeader>
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <CardDescription className="text-base">{project.company.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Tag className="w-4 h-4" />
                          <span>{project.projectcategory.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Briefcase className="w-4 h-4" />
                          <span>{project.type_of_project}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>{project.location || 'Remote'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <DollarSign className="w-4 h-4" />
                          <span>{project.salary || 'Negotiable'}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Deadline: {new Date(project.deadline).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-6 space-y-2">
                        {isProjectApplied(project.id) ? (
                          <Button 
                            disabled
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Applied
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleApply(project.id)}
                            disabled={isApplying}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            {isApplying ? 'Applying...' : 'Apply Now'}
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleViewDetails(project.id)}
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
                <p className="text-gray-500">No saved projects found.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
    <JobPortalFooter/>
    </>
  )
} 