"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function JobPortalHero() {
  return (
    <div className="bg-indigo-700 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8">Find Your Dream Job Today</h1>
        <p className="text-xl text-center mb-12">
          Discover opportunities from leading companies across various industries
        </p>
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Job title, keywords, or company"
                className="w-full pl-10 pr-4 py-3 rounded-full text-gray-900"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="City, state, or zip code"
                className="w-full pl-10 pr-4 py-3 rounded-full text-gray-900"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <Button size="lg" className="w-full sm:w-auto">
              Search Jobs
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

