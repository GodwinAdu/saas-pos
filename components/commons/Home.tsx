'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, BarChart2, Clock, Cloud, Database, Lock, RefreshCcw, Users, BookOpen, DollarSign } from 'lucide-react'
import Hero from './hero/Hero'


export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
            <Hero />
            <div className="container mx-auto px-6 ">
                {/* Animated Background Shapes */}
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-48 h-48 bg-white bg-opacity-20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-72 h-72 bg-yellow-400 bg-opacity-10 rounded-full blur-3xl animate-pulse"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="mt-16 text-center text-white"
                >
                    <h2 className="text-3xl font-bold mb-4">Trusted by Industry Leaders</h2>
                    <p className="text-xl mb-8">Join thousands of restaurants and food businesses optimizing their operations with CulinaryStock</p>
                    <div className="flex justify-center items-center space-x-8">
                        {['Brand1', 'Brand2', 'Brand3', 'Brand4'].map((brand, index) => (
                            <motion.div
                                key={brand}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                                className="bg-white bg-opacity-20 rounded-full p-4"
                            >
                                <div className="w-20 h-20 rounded-full bg-white bg-opacity-50" />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    id="features"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="mt-24"
                >
                    <h2 className="text-3xl font-bold mb-12 text-center text-white">Powerful Features for Your Business</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none text-white h-full">
                                    <CardHeader>
                                        <feature.icon className="w-12 h-12 mb-4 text-yellow-300" />
                                        <CardTitle className="text-2xl">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-100">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="mt-24 text-center text-white"
                >
                    <h2 className="text-3xl font-bold mb-4">Ready to optimize your inventory?</h2>
                    <p className="text-xl mb-8">Join thousands of satisfied users and take control of your food management today.</p>
                    <Link href="/signup">
                        <Button size="lg" className="bg-yellow-400 text-purple-800 hover:bg-yellow-300">
                            Start Your Free Trial
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.4 }}
                    className="mt-24 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-8 text-white"
                >
                    <h2 className="text-3xl font-bold mb-4 text-center">What Our Customers Say</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="bg-white bg-opacity-20 border-none text-white">
                                <CardContent className="pt-6">
                                    <p className="italic mb-4">&quot;{testimonial.quote}&quot;</p>
                                    <p className="font-semibold">{testimonial.author}</p>
                                    <p className="text-sm">{testimonial.position}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </motion.div>
                {/* Call to Action */}
                <section className="bg-indigo-600 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-extrabold mb-4">Ready to transform your business?</h2>
                        <p className="text-xl mb-8">Join thousands of businesses already using our POS system.</p>
                        <Link href="/sign-up" className="bg-white text-indigo-600 py-3 px-8 rounded-full text-lg font-semibold transition duration-300 hover:bg-gray-100">
                            Get Started
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    )
}

const features = [
    {
        title: 'Real-time Inventory Tracking',
        description: 'Monitor your stock levels in real-time with automatic updates and alerts. Never run out of crucial ingredients again.',
        icon: RefreshCcw,
    },
    {
        title: 'Smart Analytics',
        description: 'Gain valuable insights with our advanced reporting and analytics tools. Make data-driven decisions to optimize your inventory and reduce costs.',
        icon: BarChart2,
    },
    {
        title: 'Multi-location Support',
        description: 'Manage inventory across multiple locations or departments effortlessly. Perfect for restaurant chains or large catering operations.',
        icon: Database,
    },
    {
        title: 'Expiration Management',
        description: 'Stay on top of expiration dates to minimize food waste and ensure quality. Automated alerts help you use ingredients before they expire.',
        icon: Clock,
    },
    {
        title: 'Cloud-based Solution',
        description: 'Access your inventory data anytime, anywhere with our secure cloud platform. Collaborate with your team in real-time, from any device.',
        icon: Cloud,
    },
    {
        title: 'Advanced Security',
        description: 'Rest easy knowing your data is protected with state-of-the-art security measures. We use industry-standard encryption and regular backups.',
        icon: Lock,
    },
    {
        title: 'Supplier Management',
        description: 'Streamline your relationships with suppliers. Manage contacts, track orders, and automate reordering processes all in one place.',
        icon: Users,
    },
    {
        title: 'Recipe Integration',
        description: 'Link your recipes directly to your inventory. Automatically update stock levels as you prepare dishes and track recipe costs effortlessly.',
        icon: BookOpen,
    },
    {
        title: 'Cost Control',
        description: 'Keep your food costs in check with detailed cost analysis tools. Identify areas of waste and optimize your menu for profitability.',
        icon: DollarSign,
    },
]

const testimonials = [
    {
        quote: "CulinaryStock has transformed the way we manage our restaurant's inventory. It's intuitive, powerful, and has saved us both time and money.",
        author: "Emily Chen",
        position: "Head Chef, Fusion Bites"
    },
    {
        quote: "The real-time tracking and analytics have been game-changers for our catering business. We've reduced waste by 30% since implementing CulinaryStock.",
        author: "Michael Johnson",
        position: "Owner, Gourmet Events Catering"
    },
    {
        quote: "As a multi-location restaurant chain, CulinaryStock's ability to manage inventory across all our sites has streamlined our operations significantly.",
        author: "Sarah Thompson",
        position: "Operations Manager, Fresh & Fast Restaurants"
    }
]

