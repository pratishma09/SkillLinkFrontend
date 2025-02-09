"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobseekerProfileForm } from "@/components/jobseeker/ProfileForm";
import { JobPortalHeader } from "@/components/Home/JobPortalHeader";

export default function EditProfilePage() {
  return (
    <>
    <JobPortalHeader/>
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <JobseekerProfileForm />
        </CardContent>
      </Card>
    </div>
    </>
  );
}