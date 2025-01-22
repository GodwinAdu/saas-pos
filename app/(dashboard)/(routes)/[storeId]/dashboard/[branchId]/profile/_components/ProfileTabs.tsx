"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function POSProfileTabs() {
  const [activeTab, setActiveTab] = useState("performance")

  const performanceData = [
    { name: "Mon", sales: 4000 },
    { name: "Tue", sales: 3000 },
    { name: "Wed", sales: 2000 },
    { name: "Thu", sales: 2780 },
    { name: "Fri", sales: 1890 },
    { name: "Sat", sales: 2390 },
    { name: "Sun", sales: 3490 },
  ]

  return (
    <Tabs defaultValue="performance" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="inventory">Inventory</TabsTrigger>
        <TabsTrigger value="customers">Customers</TabsTrigger>
        <TabsTrigger value="training">Training</TabsTrigger>
      </TabsList>
      <TabsContent value="performance" className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
            <CardDescription>Your sales performance for the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="inventory" className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Management</CardTitle>
            <CardDescription>Current stock levels and reorder suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Product A", stock: 75, reorderPoint: 50 },
                { name: "Product B", stock: 30, reorderPoint: 40 },
                { name: "Product C", stock: 60, reorderPoint: 55 },
                { name: "Product D", stock: 90, reorderPoint: 60 },
              ].map((product) => (
                <div key={product.name} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{product.name}</span>
                    <Badge variant={product.stock < product.reorderPoint ? "destructive" : "secondary"}>
                      {product.stock < product.reorderPoint ? "Reorder" : "In Stock"}
                    </Badge>
                  </div>
                  <Progress value={(product.stock / 100) * 100} className="w-full" />
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Stock: {product.stock} / Reorder Point: {product.reorderPoint}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="customers" className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Interactions</CardTitle>
            <CardDescription>Recent customer interactions and feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "John Doe", interaction: "Purchase", feedback: "Excellent service!", date: "2023-06-15" },
                { name: "Jane Smith", interaction: "Return", feedback: "Quick and easy process", date: "2023-06-14" },
                { name: "Bob Johnson", interaction: "Inquiry", feedback: "Very helpful staff", date: "2023-06-13" },
                {
                  name: "Alice Brown",
                  interaction: "Purchase",
                  feedback: "Great product selection",
                  date: "2023-06-12",
                },
              ].map((customer, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{customer.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {customer.interaction} - {customer.date}
                    </p>
                    <p className="text-sm italic text-gray-600 dark:text-gray-300">"{customer.feedback}"</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="training" className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Training and Certifications</CardTitle>
            <CardDescription>Your completed and upcoming training modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "POS System Basics", status: "Completed", date: "2023-05-01", score: "95%" },
                { name: "Customer Service Excellence", status: "Completed", date: "2023-05-15", score: "88%" },
                { name: "Inventory Management", status: "In Progress", date: "2023-06-20", progress: 60 },
                { name: "Advanced Sales Techniques", status: "Upcoming", date: "2023-07-01" },
              ].map((training, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{training.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{training.date}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {training.status === "Completed" ? (
                      <Badge variant="success">{training.score}</Badge>
                    ) : training.status === "In Progress" ? (
                      <Progress value={training.progress} className="w-24" />
                    ) : (
                      <Badge variant="secondary">Upcoming</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

