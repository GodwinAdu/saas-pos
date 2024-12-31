"use client"


import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import {  CalculatorIcon, FileText, SkipBack } from 'lucide-react'
import UserDropdown from '../commons/user/user-dropdown'
import FullScreenButton from '../commons/FullScreenButton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import Calculator from '../commons/Calculater'
import { BranchSelect } from './BranchSelect'
import { CreateCustomerDialog } from './CeateCustomerDialog'
import SettingComponent from './Settings'
import SuspendListModal from './SuspendListModal'
import { useRouter } from 'next/navigation'
// Define the props type
interface Customer {
    id: number
    name: string
    email: string
    loyaltyPoints: number
    address: string
    phone: string
}

interface NavbarProps {
    customers: Customer[];
    setSelectedCustomer: (customer: Customer | null) => void;
    setIsTransactionHistoryOpen: (isOpen: boolean) => void;
    user: IUser;
    branches: IBranch[];
    products:any[]
}

const Navbar: React.FC<NavbarProps> = ({ customers, setSelectedCustomer, setIsTransactionHistoryOpen, user, branches,products }) => {
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const router = useRouter();

    return (
        <header className="bg-background shadow-sm p-4">
            <div className="flex justify-between items-center">
                <BranchSelect branches={branches} />
                <div className="flex items-center space-x-4">

                    <CreateCustomerDialog />
                    <Select onValueChange={(value) => setSelectedCustomer(customers?.find(c => c.id === parseInt(value)) || null)} >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                            {customers?.map(customer => (
                                <SelectItem key={customer.id} value={customer.id.toString()}>
                                    {customer.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                        <div className="relative">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
                                            variant="outline"
                                            size="icon"
                                            className="ml-2"
                                        >
                                            <CalculatorIcon className='w-4 h-4' />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Calculator</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            {isCalculatorOpen && (
                                <div className="absolute z-50 right-0 mt-2 w-64">
                                    <Calculator />
                                </div>
                            )}
                        </div>
                    <SuspendListModal products={products} />

                    <Button variant="outline" size="icon" onClick={() => setIsTransactionHistoryOpen(true)}>
                        <FileText className="h-4 w-4" />
                    </Button>
                    <div className="flex gap-4 ml-auto items-center pr-3">
                        <FullScreenButton />

                        <SettingComponent />

                        <UserDropdown
                            email={user?.email}
                            username={user?.fullName}
                            avatarUrl={user?.avatarUrl as string}
                            notificationCount={100}
                        />
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => router.back()}
                            aria-label="Go back"
                        >
                            <SkipBack className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar
