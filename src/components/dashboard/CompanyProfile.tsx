"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

export function CompanyProfile() {
  const [profile, setProfile] = useState({
    name: "TechCorp",
    website: "https://techcorp.com",
    industry: "Technology",
    size: "1000-5000 employees",
    description: "TechCorp is a leading technology company specializing in innovative software solutions.",
    location: "San Francisco, CA",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Updated profile:", profile)
    toast({
      title: "Profile Updated",
      description: "Your company profile has been successfully updated.",
    })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Company Profile</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <Input id="name" name="name" value={profile.name} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" name="website" value={profile.website} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input id="industry" name="industry" value={profile.industry} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="size">Company Size</Label>
            <Input id="size" name="size" value={profile.size} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" value={profile.location} onChange={handleChange} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Company Description</Label>
          <Textarea id="description" name="description" value={profile.description} onChange={handleChange} rows={4} />
        </div>
        <Button type="submit">Update Profile</Button>
      </form>
    </div>
  )
}

