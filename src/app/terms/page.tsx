"use client"

import { JobPortalFooter } from "@/components/Home/JobPortalFooter"
import { JobPortalHeader } from "@/components/Home/JobPortalHeader"
import Link from "next/link"

export default function TermsPage() {
  return (
    <>
    <JobPortalHeader/>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-4">
                Welcome to the College Internship Portal. These terms and conditions outline the rules and regulations for the use of our platform, which connects college students with internship opportunities.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. User Accounts</h2>
              <p className="text-gray-600 mb-4">
                To use our platform, you must create an account with accurate information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Student Responsibilities</h2>
              <p className="text-gray-600 mb-4">
                Students must provide accurate academic and personal information. Applications should be made in good faith, and students should only apply for internships they are genuinely interested in and qualified for.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Company Responsibilities</h2>
              <p className="text-gray-600 mb-4">
                Companies posting internships must provide accurate information about the position, requirements, and compensation. All postings must comply with applicable labor laws and regulations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Privacy and Data Protection</h2>
              <p className="text-gray-600 mb-4">
                We are committed to protecting your privacy. Personal information will be handled in accordance with our privacy policy and applicable data protection laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Platform Usage</h2>
              <p className="text-gray-600 mb-4">
                The platform is intended for legitimate internship opportunities. Any misuse, including but not limited to spam, fraudulent postings, or inappropriate content, will result in account termination.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Modifications</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify these terms at any time. Users will be notified of any significant changes. Continued use of the platform after such changes constitutes acceptance of the new terms.
              </p>
            </section>

          
          </div>
        </div>
      </div>
    </div>
    <JobPortalFooter/>
    </>
  )
} 