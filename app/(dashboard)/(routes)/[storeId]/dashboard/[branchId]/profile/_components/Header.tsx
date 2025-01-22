"use client"

import { useState } from "react"
import { User, Mail, Phone, Badge, Clock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AvatarUpload from "./Avatar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export default function POSProfileHeader() {
    const [isEditing, setIsEditing] = useState(false)
    const [userData, setUserData] = useState({
        name: "Alex Johnson",
        email: "alex.johnson@posystem.com",
        phone: "+1 (555) 123-4567",
        employeeId: "EMP001",
        role: "Senior Cashier",
        status: "Active",
        permissions: ["Transactions", "Refunds", "Inventory Check", "End of Day Reports"],
        shiftPreference: "Morning",
    })

    const handleEdit = () => setIsEditing(!isEditing)

    const handleSave = () => {
        setIsEditing(false)
        // Here you would typically save the data to your backend
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUserData({ ...userData, [e.target.name]: e.target.value })
    }

    const handlePermissionToggle = (permission: string) => {
        setUserData((prevData) => ({
            ...prevData,
            permissions: prevData.permissions.includes(permission)
                ? prevData.permissions.filter((p) => p !== permission)
                : [...prevData.permissions, permission],
        }))
    }

    return (
        <div className="relative">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="-mt-16 sm:-mt-24 sm:flex sm:items-end sm:space-x-5">
                    <div className="flex">
                        <Avatar className="h-36 w-36 shadow-lg">
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                        <div className="sm:hidden md:block mt-6 min-w-0 flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">{userData.name}</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{userData.role}</p>
                        </div>
                        <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                            <Button variant="outline" onClick={isEditing ? handleSave : handleEdit}>
                                {isEditing ? "Save Profile" : "Edit Profile"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {[
                        { icon: Mail, label: "Email", value: userData.email, name: "email" },
                        { icon: Phone, label: "Phone", value: userData.phone, name: "phone" },
                        { icon: Badge, label: "Employee ID", value: userData.employeeId, name: "employeeId" },
                        { icon: Shield, label: "Role", value: userData.role, name: "role" },
                        { icon: Clock, label: "Shift Preference", value: userData.shiftPreference, name: "shiftPreference" },
                    ].map((item) => (
                        <div key={item.label} className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                                <item.icon className="mr-1 h-5 w-5 text-gray-400 dark:text-gray-500" />
                                {item.label}
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                {isEditing ? (
                                    item.name === "shiftPreference" ? (
                                        <Select
                                            name={item.name}
                                            defaultValue={item.value}
                                            onValueChange={(value) => handleChange({ target: { name: item.name, value } } as any)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select shift preference" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Morning">Morning</SelectItem>
                                                <SelectItem value="Afternoon">Afternoon</SelectItem>
                                                <SelectItem value="Evening">Evening</SelectItem>
                                                <SelectItem value="Night">Night</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input
                                            type={item.name === "email" ? "email" : "text"}
                                            name={item.name}
                                            value={item.value}
                                            onChange={handleChange}
                                            className="w-full"
                                        />
                                    )
                                ) : (
                                    item.value
                                )}
                            </dd>
                        </div>
                    ))}
                </dl>
                <div className="mt-6">
                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Permissions</Label>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                        {["Transactions", "Refunds", "Inventory Check", "End of Day Reports"].map((permission) => (
                            <div key={permission} className="flex items-center space-x-2">
                                <Switch
                                    checked={userData.permissions.includes(permission)}
                                    onCheckedChange={() => handlePermissionToggle(permission)}
                                    disabled={!isEditing}
                                />
                                <Label>{permission}</Label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

