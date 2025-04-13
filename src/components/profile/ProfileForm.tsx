"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ProfileFormData {
  id?: number;
  description: string;
  website: string;
  phone: string;
  address: string;
  logo: File | null;
  logoPreview?: string;
  user:{
    name:string;
    email:string;
  }
}

interface UserData {
  id: number;
  name: string;
  email: string;
}

const initialFormState: ProfileFormData = {
  description: "",
  website: "",
  phone: "",
  address: "",
  logo: null,
  logoPreview: "",
  user:{
    name:"",
    email:""
  }
};

export function ProfileForm({ initialData }: { initialData?: ProfileFormData }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [originalData, setOriginalData] = useState<ProfileFormData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>(initialFormState);

  // Fetch user and profile data if initialData is not provided
  useEffect(() => {
    if (!initialData) {
      const fetchData = async () => {
        try {
          // Fetch user data
          const userResponse = await fetch(`${API_URL}/api/v1/user`, {
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Accept': 'application/json',
            }
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUserData(userData);

            // Fetch profile data using user ID
            const profileResponse = await fetch(`${API_URL}/users/${userData.id}/profile`, {
              credentials: 'include',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/json',
              }
            });
            
            if (profileResponse.ok) {
              const data = await profileResponse.json();
              // If profile exists, redirect to home page
              if (data) {
                router.push('/');
                return;
              }
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    } else {
      // If initialData has an existing logo, set it as existingLogo
      const updatedInitialData = {
        ...initialData,
        existingLogo: initialData.logoPreview || initialData.logo || ""
      };

      console.log(updatedInitialData);
      setFormData(updatedInitialData);
      setOriginalData(updatedInitialData);
    }
  }, [initialData, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Add all fields
      formDataToSend.append('description', formData.description || "");
      formDataToSend.append('website', formData.website || "");
      formDataToSend.append('phone', formData.phone || "");
      formDataToSend.append('address', formData.address || "");

      // Handle logo if new one is selected
      if (formData.logo) {
        formDataToSend.append('logo', formData.logo);
      }

      const response = await fetch(`${API_URL}/profiles`, {
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
        description: "Profile created successfully",
      });

      router.push('/');
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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        logo: file,
        logoPreview: previewUrl,
        existingLogo: ""
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-2xl font-bold text-center">Create Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* User Information Section */}
            
              
                <h3 className="text-lg font-semibold mb-4 text-gray-700">User Information</h3>
                
              
            

            {/* Logo Upload Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Logo</h3>
              <div className="flex flex-col items-center space-y-4">
                {formData.logoPreview ? (
                  <div className="relative w-32 h-32">
                    <Image
                      src={formData.logoPreview}
                      alt="Logo preview"
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                ) : formData.logo ? (
                  <div className="relative w-32 h-32">
                    <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${formData.logo}`}
                      alt="Existing logo"
                      fill
                      className="rounded-lg object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">No logo</span>
                  </div>
                )}
                <div className="w-full max-w-xs">
                  <Label htmlFor="logo" className="sr-only">Upload Logo</Label>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Profile Information Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Profile Information</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-600">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="min-h-[120px] bg-white"
                    placeholder="Tell us about your organization..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-gray-600">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://example.com"
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-600">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-600">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter your address"
                    className="bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button 
                type="submit" 
                className="w-full max-w-xs bg-primary hover:bg-primary/90 text-white" 
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Create Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}