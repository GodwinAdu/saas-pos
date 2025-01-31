"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
    { name: 'Jan', revenue: 24 },
    { name: 'Feb', revenue: 13 },
    { name: 'Mar', revenue: 98 },
    { name: 'Apr', revenue: 39 },
    { name: 'May', revenue: 48 },
    { name: 'Jun', revenue: 48 },
    { name: 'Jul', revenue: 48 },
    { name: 'Aug', revenue: 48 },
    { name: 'Sep', revenue: 48 },
    { name: 'Oct', revenue: 48 },
    { name: 'Nov', revenue: 48 },
    { name: 'Dec', revenue: 48 },
]

export default function MonthlySales() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Revenue({new Date().getFullYear()})</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="revenue" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

