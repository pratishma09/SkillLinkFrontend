"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface College {
  id: string;
  name: string;
}

interface JobseekerFormData {
  mobile: string;
  college_id: string;
  dob: string;
  gender: string;
  current_address: string;
  permanent_address: string;
  linkedin_url: string;
  professional_summary: string;
  skills: string[];
  image: File | null;
}

export function JobseekerProfileForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [colleges, setColleges] = useState<College[]>([]);
  const [originalData, setOriginalData] = useState<JobseekerFormData | null>(null);
  
  const [formData, setFormData] = useState<JobseekerFormData>({
    mobile: "",
    college_id: "",
    dob: "",
    gender: "",
    current_address: "",
    permanent_address: "",
    linkedin_url: "",
    professional_summary: "",
    skills: [],
    image: null
  });

  // Fetch colleges
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/colleges`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch colleges');
        
        const data = await response.json();
        setColleges(data);
      } catch (error) {
        console.error('Error fetching colleges:', error);
      }
    };

    fetchColleges();
  }, []);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/jobseeker/profile`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const profileData = {
            mobile: data.data.mobile || "",
            college_id: data.data.college_id?.toString() || "",
            dob: data.data.dob ? data.data.dob.split('T')[0] : "",
            gender: data.data.gender || "",
            current_address: data.data.current_address || "",
            permanent_address: data.data.permanent_address || "",
            linkedin_url: data.data.linkedin_url || "",
            professional_summary: data.data.professional_summary || "",
            skills: data.data.skills || [],
            image: null
          };
          setFormData(profileData);
          setOriginalData(profileData);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Add all required fields
      formDataToSend.append('mobile', formData.mobile);
      formDataToSend.append('college_id', formData.college_id);
      formDataToSend.append('dob', formData.dob);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('current_address', formData.current_address);
      formDataToSend.append('permanent_address', formData.permanent_address);

      // Add optional fields if they have values
      if (formData.linkedin_url) {
        formDataToSend.append('linkedin_url', formData.linkedin_url);
      }

      if (formData.professional_summary) {
        formDataToSend.append('professional_summary', formData.professional_summary);
      }

      if (formData.skills.length > 0) {
        formDataToSend.append('skills', JSON.stringify(formData.skills));
      }

      // Handle image if new one is selected
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(`${API_URL}/api/v1/jobseeker/profile`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save profile');
      }

      toast({
        title: "Success",
        description: originalData ? "Profile updated successfully" : "Profile created successfully",
      });

      router.push('/user/profile');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Image Upload */}
        <div className="space-y-2">
          <Label htmlFor="image">Profile Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFormData(prev => ({ ...prev, image: file }));
              }
            }}
          />
        </div>

        {/* College Selection */}
        <div className="space-y-2">
          <Label htmlFor="college">College</Label>
          <Select
            value={formData.college_id}
            onValueChange={(value) => 
              setFormData(prev => ({ ...prev, college_id: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your college" />
            </SelectTrigger>
            <SelectContent>
              {colleges.map((college) => (
                <SelectItem 
                  key={college.id} 
                  value={college.id.toString()}
                >
                  {college.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              value={formData.mobile}
              onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="current_address">Current Address</Label>
            <Input
              id="current_address"
              value={formData.current_address}
              onChange={(e) => setFormData(prev => ({ ...prev, current_address: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="permanent_address">Permanent Address</Label>
            <Input
              id="permanent_address"
              value={formData.permanent_address}
              onChange={(e) => setFormData(prev => ({ ...prev, permanent_address: e.target.value }))}
              required
            />
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="linkedin_url">LinkedIn Profile URL</Label>
            <Input
              id="linkedin_url"
              type="url"
              value={formData.linkedin_url}
              onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="professional_summary">Professional Summary</Label>
            <Textarea
              id="professional_summary"
              value={formData.professional_summary}
              onChange={(e) => setFormData(prev => ({ ...prev, professional_summary: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              id="skills"
              value={formData.skills.join(', ')}
              onChange={(e) => {
                const skillsArray = e.target.value
                  .split(',')
                  .map(skill => skill.trim())
                  .filter(Boolean);
                setFormData(prev => ({ ...prev, skills: skillsArray }));
              }}
              placeholder="e.g., PHP, Laravel, React"
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  );
}
