"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Briefcase, PenTool, Database, Microscope, ShoppingBag } from "lucide-react"

const categories = [
  { id: 1, name: "Technology", icon: Code },
  { id: 2, name: "Business", icon: Briefcase },
  { id: 3, name: "Design", icon: PenTool },
  { id: 4, name: "Data Science", icon: Database },
  { id: 5, name: "Science", icon: Microscope },
  { id: 6, name: "Sales", icon: ShoppingBag },
]

export function JobCategories() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Job Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Card key={category.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon className="mr-2 h-6 w-6" />
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="p-0">
                    Browse {category.name} Jobs
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

