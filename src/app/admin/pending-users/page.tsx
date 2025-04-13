"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Updated to next/navigation
import { VerificationModal } from '@/components/admin/VerificationModal';
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { JobPortalHeader } from '@/components/Home/JobPortalHeader';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  verification_document_path: string | null;
}

interface PaginatedResponse {
  data: User[];
  total: number;
  per_page: number;
}

export default function AdminDashboard() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const userResponse = await fetch(`${API_URL}/api/v1/admin/pending-users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }

        
        const userData = await userResponse.json();
        console.log(userData,userResponse);
        if (userData.role !== 'admin') {
          // router.push('/unauthorized');
        }

        fetchPendingUsers();
      } catch (error) {
        console.error('Error checking admin access:', error);
        setError('You are not authorized to access this page');
        router.push('/login');
      }
    };

    checkAdminAccess();
  }, [router]);

  const fetchPendingUsers = async (page = 1) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/v1/admin/pending-users?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          setError('You are not authorized to access this page');
          router.push('/unauthorized');
          return;
        }
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch users');
      }

      const data: PaginatedResponse = await response.json();
      setUsers(data.data);
      setTotalPages(Math.ceil(data.total / data.per_page));
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (userId: number) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/users/${userId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);

      toast({
        description: data.message,
      })
      
      setShowVerificationModal(false);
      fetchPendingUsers(currentPage);
    } catch (error: any) {
      toast({
        description: error.message,
        variant: "destructive",
      })
    }
  };

  const handleReject = async (userId: number, reason: string) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/users/${userId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rejection_reason: reason }),
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);

      toast({
        description: data.message,
      })
      
      setShowVerificationModal(false);
      fetchPendingUsers(currentPage);
    } catch (error: any) {
      toast({
        description: error.message,
        variant: "destructive",
      })
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <><JobPortalHeader /><div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Pending Approvals</h1>

      {users.length === 0 ? (
        <p className="text-gray-500">No pending approvals</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowVerificationModal(true);
                        } }
                      >
                        Review Document
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchPendingUsers(page)}
                className={`px-3 py-1 rounded ${currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}

      {selectedUser && (
        <VerificationModal
          isOpen={showVerificationModal}
          onClose={() => {
            setShowVerificationModal(false);
            setSelectedUser(null);
          } }
          user={selectedUser}
          onApprove={handleApprove}
          onReject={handleReject} />
      )}
    </div></>
  );
}