"use client"

import Link from "next/link"

export function JobPortalFooter() {
  return (
    <footer className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">College Internship Portal</h3>
            <p className="text-gray-300">
              Connecting students with their dream internships through a seamless platform.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Contact</h3>
            <p className="text-gray-300">
              For any inquiries, please reach out to us at:
              <br />
              <a href="mailto:support@collegeinternship.com" className="hover:text-white transition-colors">
                support@collegeinternship.com
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-purple-700/30 text-center">
          <p className="text-gray-300">
            &copy; {new Date().getFullYear()} College Internship Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

