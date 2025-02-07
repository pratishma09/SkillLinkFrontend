"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
// import Image from "next/image"

interface VerificationModalProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: number
    name: string
    email: string
    role: string
    verification_document_path: string | null
  }
  onApprove: (userId: number) => void
  onReject: (userId: number, reason: string) => void
}

export function VerificationModal({
  isOpen,
  onClose,
  user,
  onApprove,
  onReject,
}: VerificationModalProps) {
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection")
      return
    }
    await onReject(user.id, rejectionReason)
    setRejectionReason("")
    setIsRejecting(false)
  }

  const isPDF = user.verification_document_path?.toLowerCase().endsWith('.pdf')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Verification Document - {user.name}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>

          {user.verification_document_path ? (
            <div className="relative w-full border rounded-lg overflow-hidden">
              {isPDF || (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${user.verification_document_path}`}
                  alt="Verification Document"
                  className="w-full h-60 object-contain"
                />
              )}
            </div>
          ) : (
            <p className="text-red-500">No verification document uploaded</p>
          )}

          {/* Download button */}
          {user.verification_document_path && (
            <div className="flex justify-center">
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/storage/${user.verification_document_path}`}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Download Document
              </a>
            </div>
          )}

          <div className="flex flex-col space-y-4">
            {isRejecting ? (
              <>
                <Textarea
                  placeholder="Enter reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsRejecting(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                  >
                    Confirm Rejection
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex justify-end space-x-2">
                <Button
                  variant="destructive"
                  onClick={() => setIsRejecting(true)}
                >
                  Reject
                </Button>
                <Button
                  variant="default"
                  onClick={() => onApprove(user.id)}
                >
                  Approve
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 