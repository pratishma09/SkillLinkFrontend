'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = useState<'verifying' | 'success' | 'already-verified' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const id = searchParams.get('id');
        const hash = searchParams.get('hash');
        const expires = searchParams.get('expires');
        const signature = searchParams.get('signature');

        if (!id || !hash || !expires || !signature) {
          setMessage('Invalid verification link');
          setStatus('error');
          return;
        }

        const response = await fetch(
          `${API_URL}/v1/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          }
        );

        const data = await response.json();

        if (response.status === 200) {
          if (data.message.includes('already verified')) {
            setStatus('already-verified');
          } else {
            setStatus('success');
          }
          setMessage(data.message);

          // Redirect after 3 seconds
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          throw new Error(data.message || 'Verification failed');
        }
      } catch (error: any) {
        console.error('Verification error:', error);
        setMessage(error.message || 'Verification failed');
        setStatus('error');
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  const StatusIcon = {
    verifying: Loader2,
    success: CheckCircle2,
    'already-verified': AlertCircle,
    error: XCircle,
  }[status];

  const statusColors = {
    verifying: 'text-blue-500',
    success: 'text-green-500',
    'already-verified': 'text-blue-500',
    error: 'text-red-500',
  }[status];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <StatusIcon className={`h-6 w-6 ${statusColors} ${status === 'verifying' ? 'animate-spin' : ''}`} />
            {status === 'verifying' && 'Verifying Your Email'}
            {status === 'success' && 'Email Verified'}
            {status === 'already-verified' && 'Email Already Verified'}
            {status === 'error' && 'Verification Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className={statusColors}>{message}</p>
            {status !== 'verifying' && (
              <div className="space-y-2">
                {(status === 'success' || status === 'already-verified') && (
                  <p className="text-sm text-gray-500">Redirecting to login page...</p>
                )}
                <Button
                  onClick={() => router.push('/login')}
                  className="w-full"
                  variant={status === 'error' ? 'destructive' : 'default'}
                >
                  {status === 'error' ? 'Back to Login' : 'Go to Login'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 