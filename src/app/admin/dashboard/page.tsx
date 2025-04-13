import { CategoryManagement } from "@/components/admin/CategoryManagement"
import { JobPortalHeader } from "@/components/Home/JobPortalHeader"
import { JobPortalFooter } from "@/components/Home/JobPortalFooter"

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <JobPortalHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <CategoryManagement />
        </div>
      </main>
      <JobPortalFooter />
    </div>
  )
}

