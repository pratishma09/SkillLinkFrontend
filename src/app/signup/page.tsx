import { SignUpForm } from "@/components/auth/SignUpForm"
import { JobPortalHeader } from "@/components/Home/JobPortalHeader"
import { JobPortalFooter } from "@/components/Home/JobPortalFooter"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <JobPortalHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-center mb-8">Create Your JobPortal Account</h1>
        <div className="max-w-md mx-auto">
          <SignUpForm />
        </div>
      </main>
      <JobPortalFooter />
    </div>
  )
}

