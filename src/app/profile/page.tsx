'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { JobPortalHeader } from '@/components/Home/JobPortalHeader';
import { JobPortalFooter } from '@/components/Home/JobPortalFooter';

interface Profile {
  id: number;
  name: string;
  description?: string;
  website?: string;
  phone?: string;
  address?: string;
  logo?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const ids=localStorage.getItem('userId')
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${ids}/profile`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else if (response.status === 404) {
          setProfile(null);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
    <JobPortalHeader/>
    <div className="container mx-auto py-8">
      <ProfileForm initialData={profile || null} />
    </div>
    <JobPortalFooter/>
    </>
  );
} 