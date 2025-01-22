"use client"

import { useState, useEffect } from "react"
import { DollarSign, ShoppingCart, UserCheck, TrendingUp } from "lucide-react"

export default function POSProfileStats() {
  const [stats, setStats] = useState({
    totalSales: 0,
    transactionsCount: 0,
    customersServed: 0,
    avgTicketSize: 0,
  })

  useEffect(() => {
    // Simulating data fetching
    const fetchStats = async () => {
      // In a real application, this would be an API call
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              totalSales: 152350,
              transactionsCount: 1823,
              customersServed: 1650,
              avgTicketSize: 83.57,
            }),
          1000,
        ),
      )
      setStats(response as any)
    }
    fetchStats()
  }, [])

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4 p-4 sm:p-6">
        {[
          { name: "Total Sales", value: `$${stats.totalSales.toLocaleString()}`, icon: DollarSign },
          { name: "Transactions", value: stats.transactionsCount.toLocaleString(), icon: ShoppingCart },
          { name: "Customers Served", value: stats.customersServed.toLocaleString(), icon: UserCheck },
          { name: "Avg Ticket Size", value: `$${stats.avgTicketSize.toFixed(2)}`, icon: TrendingUp },
        ].map((item) => (
          <div key={item.name} className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className="h-6 w-6 text-gray-400 dark:text-gray-300" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{item.name}</dt>
                    <dd className="text-lg font-semibold text-gray-900 dark:text-white">{item.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </dl>
    </div>
  )
}

