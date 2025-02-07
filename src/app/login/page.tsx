import { LoginForm } from "@/components/auth/LoginForm"
import { JobPortalHeader } from "@/components/Home/JobPortalHeader"
import { JobPortalFooter } from "@/components/Home/JobPortalFooter"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <JobPortalHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-center mb-8">Log in to JobPortal</h1>
        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>
      </main>
      <JobPortalFooter />
    </div>
  )
}

