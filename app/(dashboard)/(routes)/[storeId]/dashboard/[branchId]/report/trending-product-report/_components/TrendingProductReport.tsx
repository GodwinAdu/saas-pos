'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, PrinterIcon } from 'lucide-react'
import { format } from 'date-fns'

const data = [
    { name: 'GULDER (Bx(es))', value: 380 },
    { name: 'BelAqua Water (Pc(s))', value: 280 },
    { name: 'Bigoo (Pc(s))', value: 240 },
    { name: 'Ice Water (Pc(s))', value: 180 },
    { name: 'black shoe (Bx(es))', value: 150 },
]

export default function TrendingProducts() {
    const [date, setDate] = useState<Date>()

    return (
        <div className="min-h-screen bg-background p-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold">Trending Products</CardTitle>
                            <CardDescription>Monitor your top performing products</CardDescription>
                        </div>
                        <Button variant="outline" size="icon">
                            <PrinterIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Filters Section */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                            <Select defaultValue="all">
                                <SelectTrigger>
                                    <SelectValue placeholder="Business Location" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Locations</SelectItem>
                                    <SelectItem value="main">Main Branch</SelectItem>
                                    <SelectItem value="north">North Branch</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select defaultValue="all">
                                <SelectTrigger>
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="beverages">Beverages</SelectItem>
                                    <SelectItem value="food">Food</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select defaultValue="all">
                                <SelectTrigger>
                                    <SelectValue placeholder="Sub Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sub Categories</SelectItem>
                                    <SelectItem value="soft-drinks">Soft Drinks</SelectItem>
                                    <SelectItem value="water">Water</SelectItem>
                                </SelectContent>
                            </Select>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>

                            <Input type="number" placeholder="Number of products" defaultValue="5" />
                        </div>

                        {/* Chart Section */}
                        <Card className="pt-6">
                            <CardHeader>
                                <CardTitle className="text-lg font-medium">Top Trending Products</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[400px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={data}
                                            margin={{
                                                top: 5,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                            <XAxis
                                                dataKey="name"
                                                className="text-xs"
                                                tick={{ fill: 'hsl(var(--foreground))' }}
                                            />
                                            <YAxis tick={{ fill: 'hsl(var(--foreground))' }} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'hsl(var(--background))',
                                                    border: '1px solid hsl(var(--border))',
                                                }}
                                            />
                                            <Bar
                                                dataKey="value"
                                                fill="hsl(var(--primary))"
                                                radius={[4, 4, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

