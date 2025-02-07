import { StudentChatInterface } from "@/components/chat/StudentChatInterface"
import { JobPortalHeader } from "@/components/Home/JobPortalHeader"
import { JobPortalFooter } from "@/components/Home/JobPortalFooter"

export default function StudentChatPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <JobPortalHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Messages</h1>
        <StudentChatInterface />
      </main>
      <JobPortalFooter />
    </div>
  )
}

