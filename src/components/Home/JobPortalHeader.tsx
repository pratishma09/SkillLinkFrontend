"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, MessageSquare, FileText, LogOut, User, Bookmark } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function JobPortalHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUserRole = localStorage.getItem('userRole')
    const storedUserName = localStorage.getItem('userName')
    setIsLoggedIn(!!token)
    setUserRole(storedUserRole)
    setUserName(storedUserName)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userName')
    localStorage.removeItem('userId')
    setIsLoggedIn(false)
    setUserRole(null)
    setUserName(null)
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.push('/login')
  }

  const isStudent = userRole === 'student'
  const isAdmin =userRole==='admin'

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-indigo-600">SkillLink</span>
            </Link>
            {/* <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link href="/jobs" className="text-gray-500 hover:text-gray-900">
                Find Jobs
              </Link>
              <Link href="/companies" className="text-gray-500 hover:text-gray-900">
                Companies
              </Link>
              <Link href="/career-advice" className="text-gray-500 hover:text-gray-900">
                Career Advice
              </Link>
            </nav> */}
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {/* <div className="relative">
              <Input
                type="text"
                placeholder="Search jobs..."
                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div> */}
            {isLoggedIn ? (
              <>
                {isStudent && (
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => router.push("/my-projects")}
                  >
                    <Bookmark className="h-4 w-4" />
                    Saved
                  </Button>
                )}
                 {!isAdmin? (
                <Button onClick={() => router.push(isStudent ? "/user/profile" : `/profile`)}>
                  Profile
                </Button>
                 ):(
                  <>
                  <Button onClick={()=>router.push('/admin/pending-users')}>Users</Button>
                  <Button onClick={()=>router.push('/admin/dashboard')}>Category</Button>
                  </>
                 )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {userName || 'Profile'}
                    </Button>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent align="end">
                  {!isAdmin && (
                    <DropdownMenuItem onClick={() => router.push(isStudent ? "/user/profile" : `/profile`)}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                  )}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {pathname !== "/login" ? (
                  <Link href="/login">
                    <Button variant="outline">Log In</Button>
                  </Link>
                ) : (
                  <Link href="/signup">
                    <Button variant="outline">Sign Up</Button>
                  </Link>
                )}
              </>
            )}
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              {isLoggedIn ? (
                <div className="space-y-2 w-full">
                  {isStudent && (
                    <Button 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => router.push("/my-projects")}
                    >
                      <Bookmark className="h-4 w-4" />
                      Saved Projects
                    </Button>
                  )}
                  <Button
                    className="w-full"
                    onClick={() => router.push(isStudent ? "/student/dashboard" : `/${userRole}/dashboard`)}
                  >
                    Dashboard
                  </Button>
                  <Button className="w-full" onClick={() => router.push(`/${userRole}/profile`)}>
                    Profile
                  </Button>
                  <Button className="w-full" variant="destructive" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  {pathname !== "/login" ? (
                    <Link href="/login" className="w-full">
                      <Button variant="outline" className="w-full">
                        Log In
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/signup" className="w-full">
                      <Button variant="outline" className="w-full">
                        Sign Up
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

