import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, BarChart2, AlertTriangle, Truck } from 'lucide-react'

export default function InventoryManagementPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">Inventory Management</h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Keep track of your stock levels and optimize your inventory with ease
          </p>
        </div>

        <div className="mt-16">
          <Image
            src="/inventory-screenshot.jpg"
            alt="Inventory Management Interface"
            width={1200}
            height={675}
            className="rounded-lg shadow-xl"
          />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Real-time Tracking", icon: Package, description: "Monitor stock levels across all locations in real-time" },
            { title: "Analytics", icon: BarChart2, description: "Gain insights into your best-selling products and trends" },
            { title: "Low Stock Alerts", icon: AlertTriangle, description: "Get notified when items are running low" },
            { title: "Supplier Management", icon: Truck, description: "Manage your suppliers and automate reordering" },
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
          <h2 className="text-3xl font-extrabold text-gray-900">Take control of your inventory</h2>
          <p className="mt-4 text-lg text-gray-500">Start optimizing your stock levels and reducing waste today.</p>
          <div className="mt-8">
            <Button size="lg">Learn More</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

