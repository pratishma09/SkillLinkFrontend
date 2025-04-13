"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobPortalHeader } from "@/components/Home/JobPortalHeader";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ApplicantDetailsPage() {
  const params = useParams();
  const { toast } = useToast();
  const [jobseeker, setJobseeker] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status,setStatus]=useState('');

  const projectId = params.id;
  const applicantId = params.id;

  const handleStatusChange = async (status: "shortlisted" | "rejected") => {
    try {
      const res = await fetch(
        `${API_URL}/projects/${projectId}/applicants/${applicantId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update status");
      }

      const data = await res.json();
      toast({
        title: "Success",
        description: `Applicant status updated to "${status}"`,
      });
      setJobseeker(data.applicant.jobseeker);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        const res = await fetch(
          `${API_URL}/projects/${projectId}/applicants/${applicantId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              Accept: "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch applicant");

        const data = await res.json();

        setJobseeker(data.data.jobseeker);
        setStatus(data.data.jobseeker_status);
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (projectId && applicantId) fetchApplicant();
  }, [projectId, applicantId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!jobseeker) {
    return (
      <div className="text-center text-gray-500 py-8">Applicant not found</div>
    );
  }

  return (
    <>
    <JobPortalHeader/>
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader className="flex flex-col items-center space-y-2">
          <div className="relative w-24 h-24">
            <Image
              src={
                jobseeker.image
                  ? `${API_URL}/storage/${jobseeker.image}`
                  : "/placeholder-user.jpg"
              }
              alt={jobseeker.user.name}
              fill
              className="rounded-full object-cover"
              unoptimized
            />
          </div>
          <CardTitle>{jobseeker.user.name}</CardTitle>
          <p className="text-gray-500">{jobseeker.user.email}</p>
          <p className="text-gray-500">
            {jobseeker.college?.name ?? "College not provided"}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">Professional Summary</h4>
            <p className="text-gray-700">
              {jobseeker.professional_summary ?? "N/A"}
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-1">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {jobseeker.skills?.length > 0 ? (
                jobseeker.skills.map((skill: string, idx: number) => (
                  <Badge key={idx} className="px-3 py-1" variant="secondary">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500">No skills listed</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-1">Work Experiences</h4>
            {jobseeker.work_experiences?.map((exp: any) => (
              <div key={exp.id} className="border rounded p-3 mb-2">
                <p className="font-semibold">{exp.title}</p>
                <p className="text-gray-600">{exp.company_name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(exp.joined_date).toLocaleDateString()} -{" "}
                  {exp.currently_working
                    ? "Present"
                    : new Date(exp.end_date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          <div>
            <h4 className="font-medium mb-1">Education</h4>
            {jobseeker.education?.map((edu: any) => (
              <div key={edu.id} className="border rounded p-3 mb-2">
                <p className="font-semibold">{edu.institution}</p>
                <p className="text-gray-600">{edu.board}</p>
                <p className="text-sm text-gray-500">
                  Graduated: {edu.graduation_year} | GPA: {edu.gpa}
                </p>
              </div>
            ))}
          </div>

          <div>
            <h4 className="font-medium mb-1">Certifications</h4>
            {jobseeker.certifications?.map((cert: any) => (
              <div key={cert.id} className="border rounded p-3 mb-2">
                <p className="font-semibold">{cert.name}</p>
                <p className="text-gray-600">{cert.issuing_organization}</p>
                <p className="text-sm text-gray-500">
                  {new Date(cert.issue_date).toLocaleDateString()} -{" "}
                  {cert.no_expiry
                    ? "No Expiry"
                    : new Date(cert.expiry_date).toLocaleDateString()}
                </p>
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    View Credential
                  </a>
                )}
              </div>
            ))}
          </div>

          <div>
            <h4 className="font-medium mb-1">Projects</h4>
            {jobseeker.projects?.map((proj: any) => (
              <div key={proj.id} className="border rounded p-3 mb-2">
                <p className="font-semibold">{proj.title}</p>
                <p className="text-gray-600">{proj.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(proj.start_date).toLocaleDateString()} -{" "}
                  {proj.currently_working
                    ? "Present"
                    : new Date(proj.end_date).toLocaleDateString()}
                </p>
                <div className="flex gap-4 mt-1">
                  {proj.project_url && (
                    <a
                      href={proj.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-sm"
                    >
                      Project URL
                    </a>
                  )}
                  {proj.github_url && (
                    <a
                      href={proj.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-sm"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        
        <div className="flex gap-4 my-6 justify-center">
  {status === "shortlisted" || status === "rejected" ? (
    <Badge variant={status === "shortlisted" ? "default" : "destructive"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  ) : (
    <>
      <Button
        variant="default"
        onClick={() => handleStatusChange("shortlisted")}
      >
        Shortlist
      </Button>
      <Button
        variant="destructive"
        onClick={() => handleStatusChange("rejected")}
      >
        Reject
      </Button>
    </>
  )}
</div>

      </Card>
    </div>
    </>
  );
}
