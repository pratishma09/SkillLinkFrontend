import { JobPortalHeader } from "@/components/Home/JobPortalHeader"
import { JobPortalHero } from "@/components/Home/JobPortalHero"
import { FeaturedJobs } from "@/components/Home/FeaturedJobs"
import { CompanySpotlight } from "@/components/Home/CompanySpotlight"
import { JobCategories } from "@/components/Home/JobCategories"
import AdminDashboard from "@/components/auth/dashboard"
import { JobPortalFooter } from "@/components/Home/JobPortalFooter"
import { LoginForm } from "@/components/auth/LoginForm"
import { SignUpForm } from "@/components/auth/SignUpForm"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <JobPortalHeader />
      <main>
        <SignUpForm/>  
      </main>
      <JobPortalFooter />
    </div>
  )
}

