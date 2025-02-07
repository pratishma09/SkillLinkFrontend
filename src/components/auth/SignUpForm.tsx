"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function SignUpForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    agreeToTerms: false,
    verification_document_path: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, verification_document_path: e.target.files[0] });
    }
  };

  const handleRoleBasedRedirect = (role: string) => {
    switch (role) {
      case 'student':
        // router.push('/auth/verify-email-notice')
        // break
      case 'college':
      case 'company':
        // break
      default:
        router.push('/login')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation checks
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match.",
      });
      setIsLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must agree to the terms and conditions.",
      });
      setIsLoading(false);
      return;
    }

    if (!formData.role) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select your role.",
      });
      setIsLoading(false);
      return;
    }

    // Validate student email
    if (formData.role === 'student' && !formData.email.endsWith('.edu.np')) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Students must use an .edu.np email address.",
      });
      setIsLoading(false);
      return;
    }

    // Validate document upload for company/college
    if (['company', 'college'].includes(formData.role)) {
      if (!formData.verification_document_path) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please upload a verification document.",
        });
        setIsLoading(false);
        return;
      }
    }

    try {
      // Create FormData object for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('password_confirmation', formData.confirmPassword);
      submitData.append('role', formData.role);

      if (formData.verification_document_path && ['company', 'college'].includes(formData.role)) {
        submitData.append('verification_document_path', formData.verification_document_path);
      }

      const response = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          Object.entries(data.errors).forEach(([field, messages]: [string, any]) => {
            const message = Array.isArray(messages) ? messages[0] : messages;
            toast({
              variant: "destructive",
              title: `${field.charAt(0).toUpperCase() + field.slice(1)} Error`,
              description: message,
            });
          });
          throw new Error('Validation failed');
        }
        throw new Error(data.message || 'Registration failed');
      }

      // Show role-specific success message
      if (formData.role === 'student') {
        toast({
          title: "Success",
          description: "Your account has been created successfully. Please verify your email to continue.",
        });
      } else {
        toast({
          title: "Registration Pending",
          description: "Please verify your email and wait until approval. We'll notify you once it's approved.",
        });
      }

      // Clear form data
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        agreeToTerms: false,
        verification_document_path: null,
      });

    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.message !== 'Validation failed') {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              name="name" 
              required 
              onChange={handleChange} 
              value={formData.name}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              required 
              onChange={handleChange} 
              value={formData.email}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              required 
              onChange={handleChange} 
              value={formData.password}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input 
              id="confirmPassword" 
              name="confirmPassword" 
              type="password" 
              required 
              onChange={handleChange} 
              value={formData.confirmPassword}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">I am a...</Label>
            <Select 
              name="role" 
              onValueChange={(value) => setFormData({ ...formData, role: value })}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="college">College</SelectItem>
                <SelectItem value="company">Company</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Document upload for company/college */}
          {['company', 'college'].includes(formData.role) && (
            <>
              <div className="space-y-2">
                <Label htmlFor="verification_document_path">Verification Document</Label>
                <Input 
                  id="verification_document_path" 
                  name="verification_document_path" 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
                <p className="text-sm text-gray-500">
                  Please upload a document to verify your {formData.role} status (PDF, JPG, PNG, max 5MB)
                </p>
              </div>
            </>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
              disabled={isLoading}
            />
            <label
              htmlFor="agreeToTerms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the terms and conditions
            </label>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </CardFooter>
    </Card>
  );
}