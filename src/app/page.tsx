"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  Hero,
  SearchSection,
  Stats,
  FeaturedInternships,
  FeaturedCompanies,
  FeaturedColleges,
  Company,
  College
} from "@/components/Home"
import { JobPortalHeader } from "@/components/Home/JobPortalHeader";
import { JobPortalFooter } from "@/components/Home/JobPortalFooter";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function HomePage() {
  const { toast } = useToast()
  const router = useRouter()

  const [internships, setInternships] = useState<any[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [colleges, setColleges] = useState<College[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    
    if (userRole === "company") {
      router.push("/profile")
      return
    } else if (userRole === "college") {
      router.push("/profile")
      return
    }
    else if (userRole === "admin") {
      router.push("/admin/dashboard")
      return
    }

    fetchInternships()
    fetchCompanies()
    fetchColleges()
  }, [])

  const fetchInternships = async () => {
    try {
      const response = await fetch(`${API_URL}/projects`)
      const data = await response.json()
      setInternships(data.data)
    } catch (error) {
      toast({
        description: "Failed to fetch internships",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${API_URL}/all/companies`)
      const data = await response.json()
      setCompanies(data)
    } catch (error) {
      toast({
        description: "Failed to fetch Companies",
        variant: "destructive",
      })
    }
  }
  const fetchColleges = async () => {
    try {
      const response = await fetch(`${API_URL}/all/colleges`)
      const data = await response.json()
      setColleges(data)
    } catch (error) {
      toast({
        description: "Failed to fetch Colleges",
        variant: "destructive",
      })
    }
  }

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = category === "all" || internship.type_of_project === category
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <JobPortalHeader />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Hero />
        <SearchSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          category={category}
          setCategory={setCategory}
          onSearch={() => console.log("Search:", searchTerm, category)}
        />
        <Stats />
        <FeaturedInternships internships={filteredInternships} />
        <FeaturedCompanies companies={companies} />
        <FeaturedColleges colleges={colleges} />
      </div>
      <JobPortalFooter />
    </>
  )
}
