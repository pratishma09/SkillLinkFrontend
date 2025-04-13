"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { College } from "./types"

interface FeaturedCollegesProps {
  colleges: College[];
}

export function FeaturedColleges({ colleges }: FeaturedCollegesProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h2 className="text-3xl font-bold mb-8">Featured Colleges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {colleges.length > 0 ? (
            colleges.map((college) => (
              <motion.div
                key={college.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow border border-gray-100">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 relative mb-4 rounded-full overflow-hidden border-4 border-gray-100">
                      <Image
  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${college.logo}`}
  alt={college.user.name}
  fill
  className="object-cover"
/>
                      </div>
                      <a href={college.website} target="_blank" className="font-bold text-xl mb-2">{college.user.name}</a>
                      <p className="text-sm text-gray-500 mb-4">{college.description}</p>
                      <p className="text-sm text-gray-500 mb-4">{college.phone}</p>
                      <p className="text-sm text-gray-500 mb-4">{college.address}</p>
                      <Button 
                        variant="outline" 
                        className="w-full border-2 group"
                      >
                        View Details
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No Colleges found.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
} 