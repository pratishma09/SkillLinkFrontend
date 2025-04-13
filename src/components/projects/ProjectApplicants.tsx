"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Applicant {
  id: number;
  jobseeker: {
    id: number;
    user: {
      name: string;
      email: string;
    };
    professional_summary: string;
    skills: string[];
    image: string;
    college: {
      name: string;
    };
  };
  jobseeker_status: string;
  applied_date: string;
}

interface ProjectApplicantsProps {
  projectId: number;
}

export function ProjectApplicants({ projectId }: ProjectApplicantsProps) {
  const { toast } = useToast();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApplicants();
  }, [projectId]);

  const fetchApplicants = async () => {
    try {
      const response = await fetch(`${API_URL}/projects/${projectId}/applicants`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        }
      });

      if (!response.ok) throw new Error('Failed to fetch applicants');

      const data = await response.json();
      setApplicants(data.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch applicants",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (applicantId: number, newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/projects/${projectId}/applicants/${applicantId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      // Update local state
      setApplicants(prev => prev.map(applicant => 
        applicant.id === applicantId 
          ? { ...applicant, jobseeker_status: newStatus }
          : applicant
      ));

      toast({
        title: "Success",
        description: "Applicant status updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update status",
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[200px]">Loading...</div>;
  }

  if (applicants.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No applicants yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {applicants.map((applicant) => (
        <Card key={applicant.id} className="overflow-hidden">
          <CardHeader className="bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative w-12 h-12">
                  <Image
                    src={applicant.jobseeker.image ? `${API_URL}/storage/${applicant.jobseeker.image}` : '/placeholder-user.jpg'}
                    alt={applicant.jobseeker.user.name}
                    fill
                    className="rounded-full object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <CardTitle className="text-lg">{applicant.jobseeker.user.name}</CardTitle>
                  <p className="text-sm text-gray-500">{applicant.jobseeker.user.email}</p>
                  {applicant.jobseeker.college && (
                    <p className="text-sm text-gray-500">{applicant.jobseeker.college.name}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Applied: {new Date(applicant.applied_date).toLocaleDateString()}
                </span>
                <Select
                  value={applicant.jobseeker_status}
                  onValueChange={(value) => handleStatusChange(applicant.id, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Professional Summary</h4>
                <p className="text-gray-600">{applicant.jobseeker.professional_summary}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {applicant.jobseeker.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 