"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Hero,
  SearchSection,
  Stats,
  FeaturedInternships,
  Company,
  FeaturedCompanies
} from "@/components/Home"
import { JobPortalHeader } from "@/components/Home/JobPortalHeader";
import { JobPortalFooter } from "@/components/Home/JobPortalFooter";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function HomePage() {
  const { toast } = useToast()
  const [internships, setInternships] = useState<any[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchInternships()
    fetchCompanies()
  }, [])

  const fetchInternships = async () => {
    try {
      const response = await fetch(`${API_URL}/projects`)
      const data = await response.json()
      console.log(data.data?.[0])
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

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = category === "all" || internship.type_of_project === category
    return matchesSearch && matchesCategory
  })

  const handleSearch = () => {
    // This function is just a placeholder for now
    // You could add additional search functionality here
    console.log("Searching for:", searchTerm, "in category:", category)
  }

  return (<>
  <JobPortalHeader/>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Hero />
      
      <SearchSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        category={category}
        setCategory={setCategory}
        onSearch={handleSearch}
      />
      
      <Stats />
      
      <FeaturedInternships internships={filteredInternships} />
      
      <FeaturedCompanies companies={companies} />
      
    </div>
    <JobPortalFooter/>
    </>
  )
}

