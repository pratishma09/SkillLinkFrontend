"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

const companies = [
  {
    id: 1,
    name: "TechCorp",
    logo: "/placeholder.svg?height=100&width=100",
    description: "Leading innovation in software development",
  },
  {
    id: 2,
    name: "InnovateCo",
    logo: "/placeholder.svg?height=100&width=100",
    description: "Revolutionizing product management",
  },
  {
    id: 3,
    name: "DesignHub",
    logo: "/placeholder.svg?height=100&width=100",
    description: "Creating beautiful user experiences",
  },
  {
    id: 4,
    name: "DataDriven",
    logo: "/placeholder.svg?height=100&width=100",
    description: "Harnessing the power of data science",
  },
  {
    id: 5,
    name: "GreenTech",
    logo: "/placeholder.svg?height=100&width=100",
    description: "Sustainable solutions for a better future",
  },
]

export function CompanySpotlight() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Company Spotlight</h2>
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {companies.map((company) => (
              <CarouselItem key={company.id} className="md:basis-1/2 lg:basis-1/3">
                <Card>
                  <CardContent className="flex flex-col items-center p-6">
                    <Image
                      src={company.logo || "/placeholder.svg"}
                      alt={`${company.name} logo`}
                      width={100}
                      height={100}
                      className="mb-4"
                    />
                    <h3 className="text-xl font-semibold mb-2">{company.name}</h3>
                    <p className="text-center text-gray-600 mb-4">{company.description}</p>
                    <Button variant="outline">View Jobs</Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  )
}

