import Link from "next/link"
import { Facebook, Twitter, LinkedinIcon as LinkedIn, Instagram } from "lucide-react"

export function JobPortalFooter() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">For Job Seekers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/browse-jobs">Browse Jobs</Link>
              </li>
              <li>
                <Link href="/career-advice">Career Advice</Link>
              </li>
              <li>
                <Link href="/resume-tips">Resume Tips</Link>
              </li>
              <li>
                <Link href="/interview-prep">Interview Prep</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">For Employers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/post-job">Post a Job</Link>
              </li>
              <li>
                <Link href="/browse-resumes">Browse Resumes</Link>
              </li>
              <li>
                <Link href="/employer-resources">Employer Resources</Link>
              </li>
              <li>
                <Link href="/pricing">Pricing</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms">Terms of Service</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-indigo-400">
                <Facebook />
              </Link>
              <Link href="#" className="hover:text-indigo-400">
                <Twitter />
              </Link>
              <Link href="#" className="hover:text-indigo-400">
                <LinkedIn />
              </Link>
              <Link href="#" className="hover:text-indigo-400">
                <Instagram />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; 2025 JobPortal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

