"use client"

import { JobPortalHeader } from "@/components/Home/JobPortalHeader"
import { ProjectForm } from "@/components/projects/ProjectForm"

export default function CreateProjectPage() {
  return (
    <>
        <JobPortalHeader/>
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <ProjectForm />
    </div>
    </>
  )
} 