import { AlertTriangle, Mail, ArrowRight } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BannedPaymentDialog, PaymentDialog } from '../_components/payment-dialog';
import { fetchStoreById } from '@/lib/actions/store.actions';

export default async function BannedStorePage({ params }: { params: StoreIdParams }) {
    const { storeId } = await params;
    const store = await fetchStoreById(storeId);
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full">
                <CardHeader className="text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-10 h-10 text-red-600" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-red-600">Store Access Suspended</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-center text-gray-600">
                        Your store access has been suspended due to outstanding issues.
                        Please resolve the issue to continue using the POS system.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h3 className="font-semibold text-red-800 mb-2">Reasons for Suspension:</h3>
                            <ul className="list-disc list-inside text-red-700 space-y-1">
                                <li>Unpaid subscription fees</li>
                                <li>Violation of usage policies</li>
                                <li>Suspicious or fraudulent activities</li>
                            </ul>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-800 mb-2">Steps to Regain Access:</h3>
                            <ul className="list-disc list-inside text-blue-700 space-y-1">
                                <li>Review and settle any outstanding subscription fees</li>
                                <li>Contact support for clarification</li>
                                <li>Ensure compliance with our policies</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <Link href="/contact" className="w-full">
                        <Button className="w-full">
                        <Mail className="mr-2 h-4 w-4" /> Contact Support
                        </Button>
                    </Link>
                    <BannedPaymentDialog store={store} />
                </CardFooter>
            </Card>
        </div>
    );
}