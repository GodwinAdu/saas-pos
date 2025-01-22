"use client"

import { useState, useRef } from "react"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AvatarUpload() {
    const [avatar, setAvatar] = useState("/placeholder.svg?height=128&width=128")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setAvatar(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className="relative group">
            <img
                className="h-32 w-32 rounded-full ring-4 ring-white dark:ring-gray-800 sm:h-40 sm:w-40 object-cover cursor-pointer transition duration-300 ease-in-out transform group-hover:opacity-75"
                src={avatar || "/placeholder.svg"}
                alt="User avatar"
                onClick={handleAvatarClick}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button variant="secondary" size="icon" className="rounded-full">
                    <Camera className="h-6 w-6" />
                </Button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
    )
}

