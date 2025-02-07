import { UserDashboard } from "@/components/dashboard/UserDashboard"
import { JobPortalHeader } from "@/components/Home/JobPortalHeader"
import { JobPortalFooter } from "@/components/Home/JobPortalFooter"

export default function UserDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <JobPortalHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">User Dashboard</h1>
        <UserDashboard />
      </main>
      <JobPortalFooter />
    </div>
  )
}

