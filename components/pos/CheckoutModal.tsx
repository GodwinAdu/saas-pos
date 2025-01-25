import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Banknote, CreditCard, Gift, QrCode } from 'lucide-react'
import { Separator } from '../ui/separator'
import Image from 'next/image'

interface CheckoutModalProps {
    isCheckoutDialogOpen: boolean;
    setIsCheckoutDialogOpen: (open: boolean) => void;
    setPaymentMethod: (method: string) => void;
    paymentMethod: string;
    total: number;
    isProcessingPayment: boolean;
    handleCheckout: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isCheckoutDialogOpen, setIsCheckoutDialogOpen, setPaymentMethod, paymentMethod, total, isProcessingPayment, handleCheckout }) => {
    return (
        <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Checkout</DialogTitle>
                    <DialogDescription>
                        Complete your purchase by selecting a payment method.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            onClick={() => setPaymentMethod('card')}
                            variant={paymentMethod === 'card' ? 'default' : 'outline'}
                        >
                            <CreditCard className="mr-2 h-4 w-4" /> Card
                        </Button>
                        <Button
                            onClick={() => setPaymentMethod('cash')}
                            variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                        >
                            <Banknote className="mr-2 h-4 w-4" /> Cash
                        </Button>
                        <Button
                            onClick={() => setPaymentMethod('gift')}
                            variant={paymentMethod === 'gift' ? 'default' : 'outline'}
                        >
                            <Gift className="mr-2 h-4 w-4" /> Gift Card
                        </Button>
                        <Button
                            onClick={() => setPaymentMethod('qr')}
                            variant={paymentMethod === 'qr' ? 'default' : 'outline'}
                        >
                            <QrCode className="mr-2 h-4 w-4" /> Paystack QR
                        </Button>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="font-bold">Total Amount:</span>
                        <span className="font-bold">${total || 0}</span>
                    </div>
                    {paymentMethod === 'qr' && (
                        <div className="flex flex-col items-center">
                            <Image
                                src="/placeholder.svg?height=200&width=200"
                                alt="Paystack QR Code"
                                width={200}
                                height={200}
                            />
                            <p className="mt-2 text-sm text-muted-foreground">Scan to pay with Paystack</p>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCheckoutDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleCheckout} disabled={isProcessingPayment}>
                        {isProcessingPayment ? 'Processing...' : 'Complete Payment'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CheckoutModal
