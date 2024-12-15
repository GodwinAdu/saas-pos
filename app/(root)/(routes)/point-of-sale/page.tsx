import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, BarChart, ShoppingCart, Users } from 'lucide-react'

export default function PointOfSalePage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">Point of Sale</h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Streamline your sales process with our intuitive and powerful POS system
          </p>
        </div>

        <div className="mt-16">
          <Image
            src="/pos.png"
            alt="Point of Sale Interface"
            width={1200}
            height={675}
            className="rounded-lg shadow-xl"
          />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Fast Transactions", icon: CreditCard, description: "Process sales quickly and efficiently" },
            { title: "Real-time Reporting", icon: BarChart, description: "Get instant insights into your sales performance" },
            { title: "Inventory Integration", icon: ShoppingCart, description: "Automatically update stock levels with each sale" },
            { title: "Customer Management", icon: Users, description: "Build customer profiles and track purchase history" },
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
          <h2 className="text-3xl font-extrabold text-gray-900">Ready to transform your sales process?</h2>
          <p className="mt-4 text-lg text-gray-500">Start using our POS system today and see the difference it makes in your business.</p>
          <div className="mt-8">
            <Button size="lg">Get Started</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

