"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function LoginForm() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('userRole')
    if (token && userRole) {
      handleRoleBasedRedirect(userRole)
    }
  }, [router])

  const handleRoleBasedRedirect = (role: string) => {
    switch (role) {
      case 'admin':
        router.push('/home')
        break
      case 'student':
        router.push('/student/dashboard')
        break
      case 'college':
        router.push('/college/dashboard')
        break
      case 'company':
        router.push('/company/dashboard')
        break
      default:
        router.push('/home')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          description: data.message,
          variant: "destructive",
        })
        return
      }

      // Store user data if login successful
      localStorage.setItem('token', data.token)
      localStorage.setItem('userRole', data.user.role)
      localStorage.setItem('userId', data.user.id)
      localStorage.setItem('userName', data.user.name)

      toast({
        description: data.message,
      })

      if (data.user.role === 'student') {
        const profileResponse = await fetch(`${API_URL}/api/v1/jobseeker/profile`, {
          headers: {
            'Authorization': `Bearer ${data.token}`,
            'Accept': 'application/json',
          }
        });

        if (profileResponse) {
          router.push('/user/profile');
          return;
        }
      }


      // Redirect based on role
      handleRoleBasedRedirect(data.user.role)

    } catch (error: any) {
      toast({
        description: "An error occurred during login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link 
          href="/forgot-password" 
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot password?
        </Link>
        <Link 
          href="/signup" 
          className="text-sm text-blue-600 hover:underline"
        >
          Don't have an account? Sign up
        </Link>
      </CardFooter>
    </Card>
  )
}