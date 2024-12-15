
import ContactForm from '@/components/contact/contact-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Phone, Mail } from 'lucide-react'

export default function ContactPage() {
    return (
        <div className="bg-background min-h-screen">
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">Contact Us</h1>
                    <p className="mt-2 text-lg text-gray-500">
                        We&apos;re here to help and answer any question you might have.
                    </p>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="text-center">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                            <MapPin className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <h3 className="mt-6 text-lg font-medium text-foreground">Our Office</h3>
                        <p className="mt-2 text-base text-muted-foreground">
                            123 POS Street<br />
                            San Francisco, CA 94107
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                            <Phone className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <h3 className="mt-6 text-lg font-medium text-foreground">Call Us</h3>
                        <p className="mt-2 text-base text-muted-foreground">
                            +233 (551) 556-650<br />
                            Mon-Fri 9am to 6pm
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                            <Mail className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <h3 className="mt-6 text-lg font-medium text-foreground">Email Us</h3>
                        <p className="mt-2 text-base text-muted-foreground">
                            gyamfiadu01gmail.com<br />
                            jutechdevs@gmail.com
                        </p>
                    </div>
                </div>

                <div className="mt-4">
                    <Card className='max-w-4xl mx-auto'>
                        <CardHeader>
                            <CardTitle>Send us a message</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ContactForm />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

