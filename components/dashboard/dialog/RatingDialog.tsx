"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { SendHorizonal } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ThankYouNote } from '@/components/commons/thank-you-note'

const ratingCategories = [
    { name: 'ease_of_use', label: 'Ease of Use' },
    { name: 'speed', label: 'Speed' },
    { name: 'reliability', label: 'Reliability' },
    { name: 'features', label: 'Features' },
    { name: 'customer_support', label: 'Customer Support' },
    { name: 'user_interface', label: 'User Interface' },
    { name: 'reporting', label: 'Reporting Capabilities' },
    { name: 'inventory_management', label: 'Inventory Management' },
    { name: 'payment_processing', label: 'Payment Processing' },
    { name: 'mobile_compatibility', label: 'Mobile Compatibility' },
]

const improvementAreas = [
    { id: 'ui', label: 'User Interface' },
    { id: 'speed', label: 'System Speed' },
    { id: 'features', label: 'Additional Features' },
    { id: 'reporting', label: 'Reporting Capabilities' },
    { id: 'integration', label: 'Third-party Integrations' },
    { id: 'support', label: 'Customer Support' },
    { id: 'inventory', label: 'Inventory Management' },
    { id: 'payments', label: 'Payment Processing' },
    { id: 'mobile', label: 'Mobile App' },
    { id: 'offline', label: 'Offline Functionality' },
    { id: 'customization', label: 'Customization Options' },
    { id: 'training', label: 'User Training and Onboarding' },
]


export function RatingDialog() {
    interface FormData {
        overall_rating: string;
        ease_of_use: string;
        speed: string;
        reliability: string;
        features: string;
        customer_support: string;
        user_interface: string;
        reporting: string;
        inventory_management: string;
        payment_processing: string;
        mobile_compatibility: string;
        improvement_areas: string[];
        feature_suggestion: string;
        likelihood_to_recommend: number;
        comments: string;
    }

    const [formData, setFormData] = useState<FormData>({
        overall_rating: '',
        ease_of_use: '',
        speed: '',
        reliability: '',
        features: '',
        customer_support: '',
        user_interface: '',
        reporting: '',
        inventory_management: '',
        payment_processing: '',
        mobile_compatibility: '',
        improvement_areas: [],
        feature_suggestion: '',
        likelihood_to_recommend: 1,
        comments: '',
    })
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleRatingChange = (category: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [category]: value }))
    }

    const handleImprovementChange = (areaId: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            improvement_areas: checked
                ? [...prev.improvement_areas, areaId]
                : prev.improvement_areas.filter(id => id !== areaId)
        }))
    }


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Form submitted:', formData)
        // Here you would typically send the data to your backend
        setIsSubmitted(true)
    }

    const handleClose = () => {
        setIsSubmitted(false)
        // Reset form data here if needed
        setFormData({
            overall_rating: '',
            ease_of_use: '',
            speed: '',
            reliability: '',
            features: '',
            customer_support: '',
            user_interface: '',
            reporting: '',
            inventory_management: '',
            payment_processing: '',
            mobile_compatibility: '',
            improvement_areas: [],
            feature_suggestion: '',
            likelihood_to_recommend: 1,
            comments: '',
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full" size="sm"><SendHorizonal />
                    Feedback</Button>
            </DialogTrigger>
            <DialogContent className="w-[96%] max-w-2xl h-5/6 overflow-auto">

                <AnimatePresence mode="wait">
                    {isSubmitted ? (
                        <ThankYouNote key="thank-you" onClose={handleClose} />
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="w-full max-w-3xl mx-auto">
                                <CardHeader>
                                    <CardTitle>Feedback</CardTitle>
                                    <CardDescription>We value your detailed opinion. Please rate your experience with our POS system and suggest improvements.</CardDescription>
                                </CardHeader>
                                <form onSubmit={handleSubmit}>
                                    <CardContent className="space-y-6">
                                        {/* Overall Rating */}
                                        <div className="space-y-2">
                                            <Label htmlFor="overall_rating" className="text-base font-semibold">
                                                Overall Rating
                                            </Label>
                                            <RadioGroup
                                                id="overall_rating"
                                                className="flex space-x-4"
                                                value={formData.overall_rating}
                                                onValueChange={(value) => handleRatingChange('overall_rating', value)}
                                            >
                                                {[1, 2, 3, 4, 5].map((rating) => (
                                                    <div key={rating} className="flex items-center space-x-2">
                                                        <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                                                        <Label htmlFor={`rating-${rating}`}>{rating}</Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </div>

                                        {/* Category Ratings */}
                                        {/* Category Ratings */}
                                        {ratingCategories.map((category) => (
                                            <div key={category.name} className="space-y-2">
                                                <Label htmlFor={category.name} className="text-base">
                                                    {category.label}
                                                </Label>
                                                <RadioGroup
                                                    id={category.name}
                                                    className="flex space-x-4"
                                                    value={formData[category.name as keyof typeof formData] as string}
                                                    onValueChange={(value) => handleRatingChange(category.name, value)}
                                                >
                                                    {[1, 2, 3, 4, 5].map((rating) => (
                                                        <div key={rating} className="flex items-center space-x-2">
                                                            <RadioGroupItem value={rating.toString()} id={`${category.name}-${rating}`} />
                                                            <Label htmlFor={`${category.name}-${rating}`}>{rating}</Label>
                                                        </div>
                                                    ))}
                                                </RadioGroup>
                                            </div>
                                        ))}

                                        {/* Areas for Improvement */}
                                        <div className="space-y-2">
                                            <Label className="text-base font-semibold">Areas for Improvement</Label>
                                            <div className="grid grid-cols-2 gap-4">
                                                {improvementAreas.map((area) => (
                                                    <div key={area.id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={area.id}
                                                            checked={formData.improvement_areas.includes(area.id)}
                                                            onCheckedChange={(checked) => handleImprovementChange(area.id, checked as boolean)}
                                                        />
                                                        <Label htmlFor={area.id}>{area.label}</Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Feature Suggestion */}
                                        <div className="space-y-2">
                                            <Label htmlFor="feature_suggestion" className="text-base font-semibold">
                                                Suggest an Additional Feature
                                            </Label>
                                            <Textarea
                                                id="feature_suggestion"
                                                placeholder="What new feature would you like to see in our POS system?"
                                                value={formData.feature_suggestion}
                                                onChange={(e) => setFormData(prev => ({ ...prev, feature_suggestion: e.target.value }))}
                                            />
                                        </div>

                                        {/* Likelihood to Recommend */}
                                        <div className="space-y-2">
                                            <Label htmlFor="likelihood_to_recommend" className="text-base font-semibold">
                                                How likely are you to recommend our POS system to others?
                                            </Label>
                                            <Slider
                                                id="likelihood_to_recommend"
                                                min={0}
                                                max={10}
                                                step={1}
                                                value={[formData.likelihood_to_recommend]}
                                                onValueChange={(value) => handleRatingChange('likelihood_to_recommend', value[0])}
                                                className="w-full"
                                            />
                                            <div className="flex justify-between text-sm text-muted-foreground">
                                                <span>0</span>
                                                <span>1</span>
                                                <span>2</span>
                                                <span>3</span>
                                                <span>4</span>
                                                <span>5</span>
                                                <span>6</span>
                                                <span>7</span>
                                                <span>8</span>
                                                <span>9</span>
                                                <span>10</span>
                                            </div>
                                        </div>

                                        {/* Additional Comments */}
                                        <div className="space-y-2">
                                            <Label htmlFor="comments" className="text-base font-semibold">
                                                Additional Comments
                                            </Label>
                                            <Textarea
                                                id="comments"
                                                placeholder="Please share any additional feedback or suggestions for improvement..."
                                                value={formData.comments}
                                                onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button type="submit" className="w-full">Submit Feedback</Button>
                                    </CardFooter>
                                </form>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
}
