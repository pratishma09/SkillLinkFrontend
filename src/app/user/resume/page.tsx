import { ResumeForm } from "@/components/jobs/ResumeForm"
import { JobPortalHeader } from "@/components/Home/JobPortalHeader"
import { JobPortalFooter } from "@/components/Home/JobPortalFooter"

export default function ResumePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <JobPortalHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-center mb-8">Your Resume</h1>
        <div className="max-w-3xl mx-auto">
          <ResumeForm />
        </div>
      </main>
      <JobPortalFooter />
    </div>
  )
}

