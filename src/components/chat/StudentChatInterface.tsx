"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for chat conversations
const conversations = [
  {
    id: 1,
    company: "TechCorp",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thank you for your interest in our position.",
  },
  {
    id: 2,
    company: "InnovateCo",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Can we schedule an interview next week?",
  },
  {
    id: 3,
    company: "DesignHub",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "We've reviewed your portfolio and would like to discuss further.",
  },
]

// Mock data for chat messages
const initialMessages = [
  {
    id: 1,
    sender: "TechCorp",
    content: "Hello! Thanks for applying to our Senior Software Engineer position.",
    timestamp: "10:00 AM",
  },
  {
    id: 2,
    sender: "You",
    content: "Thank you for considering my application. I'm excited about the opportunity!",
    timestamp: "10:05 AM",
  },
  {
    id: 3,
    sender: "TechCorp",
    content: "Great! We'd like to schedule an initial interview. Are you available next Tuesday at 2 PM?",
    timestamp: "10:10 AM",
  },
]

export function StudentChatInterface() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: "You",
          content: newMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
      setNewMessage("")
    }
  }

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden">
      {/* Conversation List */}
      <div className="w-1/3 bg-white border-r">
        <ScrollArea className="h-full">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-4 cursor-pointer hover:bg-gray-100 ${selectedConversation.id === conv.id ? "bg-gray-100" : ""}`}
              onClick={() => setSelectedConversation(conv)}
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={conv.avatar} alt={conv.company} />
                  <AvatarFallback>{conv.company[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{conv.company}</p>
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>{selectedConversation.company}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {messages.map((message) => (
                <div key={message.id} className={`mb-4 ${message.sender === "You" ? "text-right" : ""}`}>
                  <div
                    className={`inline-block p-2 rounded-lg ${message.sender === "You" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  >
                    {message.content}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button type="submit">Send</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

