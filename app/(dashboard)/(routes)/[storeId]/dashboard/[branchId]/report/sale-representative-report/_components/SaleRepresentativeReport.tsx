'use client'

import { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {  FileSpreadsheet, FileIcon as FilePdf, Printer, MoreVertical, ArrowUpDown, Search } from 'lucide-react'
import { DateRangePicker } from '@/components/ui/date-range-picker'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

export default function SaleRepresentativeReport() {
    const [searchQuery, setSearchQuery] = useState('')

    const salesData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Sales',
                data: [6437, 5200, 7800, 4900, 6800, 7200],
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
            },
        ],
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Sales Representative Report</h1>
                <div className="flex items-center gap-4">
                    <Select defaultValue="all-users">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-users">All Users</SelectItem>
                            <SelectItem value="john">John Doe</SelectItem>
                            <SelectItem value="jane">Jane Smith</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select defaultValue="all-locations">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-locations">All locations</SelectItem>
                            <SelectItem value="accra">Accra Shop</SelectItem>
                            <SelectItem value="warehouse">Main Warehouse</SelectItem>
                        </SelectContent>
                    </Select>
                    <DateRangePicker />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">GHS 6,437.00</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">GHS 0.00</div>
                        <p className="text-xs text-muted-foreground">
                            No returns this period
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">GHS 0.00</div>
                        <p className="text-xs text-muted-foreground">
                            No expenses recorded
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Sales Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <Bar data={salesData} options={{ responsive: true }} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Sales Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Search transactions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-64"
                            />
                            <Button variant="outline" size="icon">
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                Export Excel
                            </Button>
                            <Button variant="outline" size="sm">
                                <FilePdf className="mr-2 h-4 w-4" />
                                Export PDF
                            </Button>
                            <Button variant="outline" size="sm">
                                <Printer className="mr-2 h-4 w-4" />
                                Print
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">
                                        <Button variant="ghost" className="h-8 p-0">
                                            Date
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>Invoice No.</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="text-right">Paid</TableHead>
                                    <TableHead className="text-right">Remaining</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>13/01/2025</TableCell>
                                    <TableCell>20230349</TableCell>
                                    <TableCell>Walk-in Customer</TableCell>
                                    <TableCell>Accra Shop</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">Due</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">GHS 25.00</TableCell>
                                    <TableCell className="text-right">GHS 0.00</TableCell>
                                    <TableCell className="text-right">GHS 25.00</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>View details</DropdownMenuItem>
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem>Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                                {/* Add more rows as needed */}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex-1 text-sm text-muted-foreground">
                            Showing 1 to 10 of 100 entries
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                                Previous
                            </Button>
                            <Button variant="outline" size="sm">
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

