"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { JobseekerProfileForm } from "@/components/jobseeker/ProfileForm"
import { useRouter } from "next/navigation"
import { EducationForm } from "@/components/jobseeker/EducationForm"
import { WorkExperienceForm } from "@/components/jobseeker/WorkExperienceForm"
import { CertificationForm } from "@/components/jobseeker/CertificationForm"
import { ProjectForm } from "@/components/jobseeker/ProjectForm"
import { useToast } from "@/hooks/use-toast"
import { JobPortalHeader } from "@/components/Home/JobPortalHeader"

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface JobseekerProfile {
  image: string | null
  mobile: string
  dob: string
  gender: string
  current_address: string
  permanent_address: string
  linkedin_url: string
  professional_summary: string
  skills: string[]
  education: {
    id: number;
    institution: string;
    board: string;
    graduation_year: string;
    gpa: string;
  }[];
  workExperiences: {
    id: number;
    title: string;
    company_name: string;
    joined_date: string;
    end_date?: string;
    currently_working: boolean;
  }[];
  certifications: {
    id: number;
    name: string;
    issuing_organization: string;
    issue_date: string;
    expiry_date?: string;
    no_expiry: boolean;
    credential_id?: string;
    credential_url?: string;
  }[];
  projects: {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date?: string;
    currently_working: boolean;
    project_url?: string;
    github_url?: string;
  }[];
  user: {
    id: number;
    name: string;
    email: string;
  };
  college: {
    id: number;
    name: string;
  };
}

export default function JobseekerProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [profile, setProfile] = useState<JobseekerProfile | null>(null)
  const [editMode, setEditMode] = useState<'profile' | 'education' | 'experience' | 'certification' | 'project' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/jobseeker/profile`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type':'application/json'
          }
        })


        const data = await response.json()
        console.log(data);

        if (!response.ok) {
          toast({
            variant: "destructive",
            title: "Profile Not Found",
            description: "Please complete your profile first",
          })
          router.push('/user/profile/edit')
          return
        }

        const transformedData: JobseekerProfile = {
          image: data.data.image,
          mobile: data.data.mobile,
          dob: data.data.dob || '',
          gender: data.data.gender || '',
          current_address: data.data.current_address,
          permanent_address: data.data.permanent_address,
          linkedin_url: data.data.linkedin_url || '',
          professional_summary: data.data.professional_summary || '',
          skills: data.data.skills || [],
          education: data.data.education || [],
          workExperiences: data.data.work_experiences || [],
          certifications: data.data.certifications || [],
          projects: data.data.projects || [],
          user: data.data.user,
          college: data.data.college
        }

        setProfile(transformedData)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch profile. Redirecting to profile creation.",
        })
        router.push('/user/profile/edit')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router, toast])

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="p-6">
            Loading profile...
          </CardContent>
        </Card>
      </div>
    )
  }

  if (editMode === 'education') {
    return (
<>
<JobPortalHeader/>
      <div className="container mx-auto py-6 px-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Edit Education</CardTitle>
              <Button variant="outline" onClick={() => setEditMode(null)}>
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <EducationForm 
              initialEducation={profile?.education || []}
              onSave={(education) => {
                if (profile) {
                  setProfile({ ...profile, education });
                }
                setEditMode(null);
              }}
            />
          </CardContent>
        </Card>
      </div>
</>
    );
  }

  if (editMode === 'experience') {
    return (
      <>
    <JobPortalHeader/>
      <div className="container mx-auto py-6 px-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Edit Work Experience</CardTitle>
              <Button variant="outline" onClick={() => setEditMode(null)}>
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <WorkExperienceForm 
              initialExperiences={profile?.workExperiences || []}
              onSave={(workExperiences) => {
                if (profile) {
                  setProfile({ ...profile, workExperiences });
                }
                setEditMode(null);
              }}
            />
          </CardContent>
        </Card>
      </div>
      </>
    );
  }

  if (editMode === 'profile') {
    return (
      <>
    <JobPortalHeader/>
      <div className="container mx-auto py-6 px-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Edit Profile</CardTitle>
              <Button variant="outline" onClick={() => setEditMode(null)}>
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <JobseekerProfileForm />
          </CardContent>
        </Card>
      </div>
      </>
    );
  }

  if (editMode === 'certification') {
    return (
      <>
    <JobPortalHeader/>
      <div className="container mx-auto py-6 px-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Edit Certifications</CardTitle>
              <Button variant="outline" onClick={() => setEditMode(null)}>
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CertificationForm 
              initialCertifications={profile?.certifications || []}
              onSave={(certifications) => {
                if (profile) {
                  setProfile({ ...profile, certifications });
                }
                setEditMode(null);
              }}
            />
          </CardContent>
        </Card>
      </div>
      </>
    );
  }

  if (editMode === 'project') {
    return (
      <>
    <JobPortalHeader/>
      <div className="container mx-auto py-6 px-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Edit Projects</CardTitle>
              <Button variant="outline" onClick={() => setEditMode(null)}>
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ProjectForm 
              initialProjects={profile?.projects || []}
              onSave={(projects) => {
                if (profile) {
                  setProfile({ ...profile, projects });
                }
                setEditMode(null);
              }}
            />
          </CardContent>
        </Card>
      </div>
      </>
    );
  }

  return (
    <>
    <JobPortalHeader/>
    <div className="container mx-auto py-6 px-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.image ? `${API_URL}/storage/${profile.image}` : undefined} />
                <AvatarFallback>{profile?.user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{profile?.user?.name}</CardTitle>
                <p className="text-gray-500">{profile?.user?.email}</p>
                {profile?.college && (
                  <p className="text-sm text-gray-600">
                    College: {profile.college.name}
                  </p>
                )}
              </div>
            </div>
            <Button onClick={() => router.push('/user/profile/edit')}>
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {profile ? (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-4">
                
                <div>
                  {/* <h2 className="text-2xl font-bold">{userName}</h2> */}
                  <p className="text-gray-500">Contact Number: {profile.mobile}</p>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Basic Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Date of Birth:</span> {profile.dob? profile.dob.split('T')[0] : ''}</p>
                    <p><span className="font-medium">Gender:</span> {profile.gender}</p>
                    <p><span className="font-medium">Current Address:</span> {profile.current_address}</p>
                    <p><span className="font-medium">Permanent Address:</span> {profile.permanent_address}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Professional Information</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">LinkedIn:</span>{" "}
                      {profile.linkedin_url && (
                        <a 
                          href={profile.linkedin_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Profile
                        </a>
                      )}
                    </p>
                    
                  </div>
                </div>
              </div>

              {/* Professional Summary */}
              <div>
                <h3 className="font-semibold mb-2">Professional Summary</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{profile.professional_summary}</p>
              </div>

              {/* Skills */}
              <div>
                <h3 className="font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills?.map((skill, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Education</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditMode('education')}
                  >
                    {profile.education?.length > 0 ? 'Edit' : 'Add'} Education
                  </Button>
                </div>
                {profile.education && profile.education.length > 0 ? (
                  <div className="space-y-4">
                    {profile.education.map((edu, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium">{edu.institution}</p>
                            <p className="text-gray-600">{edu.board}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">Graduation Year: {edu.graduation_year}</p>
                            <p className="text-gray-600">GPA: {edu.gpa}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No education information added</p>
                )}
              </div>

              {/* Work Experience Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Work Experience</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditMode('experience')}
                  >
                    {profile.workExperiences?.length > 0 ? 'Edit' : 'Add'} Experience
                  </Button>
                </div>
                {profile.workExperiences && profile.workExperiences.length > 0 ? (
                  <div className="space-y-4">
                    {profile.workExperiences.map((exp, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{exp.title}</p>
                              <p className="text-gray-600">{exp.company_name}</p>
                            </div>
                            <div className="text-right text-sm text-gray-600">
                              <p>{new Date(exp.joined_date).toLocaleDateString()} - {' '}
                                {exp.currently_working ? 'Present' : exp.end_date && new Date(exp.end_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No work experience added</p>
                )}
              </div>

              {/* Certifications Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Certifications</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditMode('certification')}
                  >
                    {profile.certifications?.length > 0 ? 'Edit' : 'Add'} Certifications
                  </Button>
                </div>
                {profile.certifications && profile.certifications.length > 0 ? (
                  <div className="space-y-4">
                    {profile.certifications.map((cert, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{cert.name}</p>
                              <p className="text-gray-600">{cert.issuing_organization}</p>
                              {cert.credential_id && (
                                <p className="text-sm text-gray-500">Credential ID: {cert.credential_id}</p>
                              )}
                            </div>
                            <div className="text-right text-sm text-gray-600">
                              <p>Issued: {new Date(cert.issue_date).toLocaleDateString()}</p>
                              {!cert.no_expiry && cert.expiry_date && (
                                <p>Expires: {new Date(cert.expiry_date).toLocaleDateString()}</p>
                              )}
                              {cert.no_expiry && <p>No Expiration</p>}
                            </div>
                          </div>
                          {cert.credential_url && (
                            <a 
                              href={cert.credential_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              View Credential
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No certifications added</p>
                )}
              </div>

              {/* Projects Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Projects</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditMode('project')}
                  >
                    {profile.projects?.length > 0 ? 'Edit' : 'Add'} Projects
                  </Button>
                </div>
                {profile.projects && profile.projects.length > 0 ? (
                  <div className="space-y-4">
                    {profile.projects.map((project, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{project.title}</p>
                              <p className="text-gray-700 mt-2">{project.description}</p>
                            </div>
                            <div className="text-right text-sm text-gray-600">
                              <p>{new Date(project.start_date).toLocaleDateString()} - {' '}
                                {project.currently_working ? 'Present' : project.end_date && new Date(project.end_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-4 mt-2">
                            {project.project_url && (
                              <a 
                                href={project.project_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                              >
                                View Project
                              </a>
                            )}
                            {project.github_url && (
                              <a 
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                              >
                                View on GitHub
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No projects added</p>
                )}
              </div>

            </div>
          ) : (
            <p>No profile information available</p>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  )
} 