import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Gift, TrendingUp, MessageSquare } from 'lucide-react'

export default function CustomerRelationshipPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">Customer Relationship</h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Build lasting relationships with your customers and drive loyalty
          </p>
        </div>

        <div className="mt-16">
          <Image
            src="/hero1.jpg"
            alt="Customer Relationship Management Interface"
            width={1200}
            height={675}
            className="rounded-lg shadow-xl"
          />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Customer Profiles", icon: Users, description: "Create detailed profiles with purchase history and preferences" },
            { title: "Loyalty Programs", icon: Gift, description: "Implement and manage customer loyalty programs" },
            { title: "Sales Analytics", icon: TrendingUp, description: "Track customer behavior and identify sales opportunities" },
            { title: "Communication Tools", icon: MessageSquare, description: "Engage with customers through integrated messaging" },
          ].map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="h-8 w-8 text-indigo-600" />
                <CardTitle className="mt-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Elevate your customer relationships</h2>
          <p className="mt-4 text-lg text-gray-500">Start building stronger connections with your customers today.</p>
          <div className="mt-8">
            <Button size="lg">Get Started</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

