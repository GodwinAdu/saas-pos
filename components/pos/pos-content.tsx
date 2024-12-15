'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogFooter, } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Plus, Minus, X,Search} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'
import TransactionHistoryModal from './TransactionModal'
import CheckoutModal from './CheckoutModal'
import UnitSelect from './UnitSelect'
import { useCartStore } from '@/hooks/use-cart'
import { Receipt } from './Receipt'

import { SellingGroup } from './selling-group'
import { findAutomatedPrice, findManualPrice } from '@/lib/utils'
import { useSelectSellingGroup } from '@/hooks/use-select-selling-group'
import SuspendModal from './SuspendModal'
import OrderModal from './OrderModal'
import AddExpensesModal from './AddExpenses'
import Navbar from './Navbar'



interface Product {
    id: number
    name: string
    price: number
    image: string
    inventory: number
    category: string
    barcode: string
}

interface CartItem extends Product {
    quantity: number
}

interface Customer {
    id: number
    name: string
    email: string
    loyaltyPoints: number
    address: string
    phone: string
}

interface SaleTransaction {
    id: number
    date: Date
    customer: Customer | null
    items: CartItem[]
    total: number
    paymentMethod: 'card' | 'cash' | 'gift' | 'qr'
    discount: number
}



const customers: Customer[] = [
    { id: 1, name: "John Doe", email: "john@example.com", loyaltyPoints: 100, address: "123 Main St, Anytown, USA", phone: "555-1234" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", loyaltyPoints: 50, address: "456 Elm St, Othertown, USA", phone: "555-5678" },
]

export default function PosContent({ user, branches, branch, products }: { user: IUser, branches: IBranch[], branch: IBranch, products: any[] }) {
    const {
        cartItems,
        discountPercent,
        updateUnit,
        addToCart,
        removeFromCart,
        updateQuantity,
        setDiscountPercent,
        clearCart,
    } = useCartStore();
    const { selectedValue } = useSelectSellingGroup()


    const [activeTab, setActiveTab] = useState("products")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
    const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'gift' | 'qr'>('card')
    const [isProcessingPayment, setIsProcessingPayment] = useState(false)
    const [transactions, setTransactions] = useState<SaleTransaction[]>([])
    const [isTransactionHistoryOpen, setIsTransactionHistoryOpen] = useState(false)
    const [isBarcodeMode, setIsBarcodeMode] = useState(false)
    const [barcodeInput, setBarcodeInput] = useState("")
    const [quantity, setQuantity] = useState(1)
    const [selectedUnit, setSelectedUnit] = useState('')
    const [showReceipt, setShowReceipt] = useState(false)


    const invoiceRef = useRef<HTMLDivElement>(null)

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "All" || product.category === selectedCategory)
    )



    // for manual price
    const subtotalManual = cartItems.reduce((sum, item) => sum + findManualPrice(item.item.manualPrice, item.unit as string) * item.quantity, 0);
    const subtotalAutomated = cartItems.reduce((sum, item) => sum + findAutomatedPrice(item.item, item.item.unit, item.unit as string, selectedValue as string) * item.quantity, 0);
    const discount = (branch.pricingType === 'manual' ? subtotalManual : subtotalAutomated) * (discountPercent / 100);
    const total = (branch.pricingType === 'manual' ? subtotalManual : subtotalAutomated) - discount;



    // for automated Price




    // Functionality remains the same, just use Zustand actions/state
    const handleCheckout = async () => {
        setIsProcessingPayment(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        completeTransaction();
    };

    const completeTransaction = () => {
        setIsProcessingPayment(false);
        setIsCheckoutDialogOpen(false);

        const newTransaction: SaleTransaction = {
            id: transactions.length + 1,
            date: new Date(),
            customer: selectedCustomer,
            items: [...cartItems],
            total: total,
            paymentMethod: paymentMethod,
            discount: discount,
        };

        setTransactions([...transactions, newTransaction]);

        toast({
            title: 'Payment Successful',
            description: `Total amount: $${total.toFixed(2)}`,
        });

        setShowReceipt(true);
    };


    const handleBarcodeSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const product = products.find(p => p.barcode === barcodeInput)
        if (product) {
            addToCart(product)
            setBarcodeInput("")
        } else {
            toast({
                title: "Product Not Found",
                description: "No product matches the entered barcode.",
                variant: "destructive",
            })
        }
    }

    const categories = ["All", ...Array.from(new Set(products?.map(p => p.category)))]

    return (
        <div className="flex flex-col h-screen bg-gray-100">

            <Navbar branches={branches} user={user} customers={customers} setSelectedCustomer={setSelectedCustomer} setIsTransactionHistoryOpen={setIsTransactionHistoryOpen} />
            <main className="flex-grow flex flex-col md:flex-row overflow-hidden bg-background">
                <div className="w-full md:w-2/3 p-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="products">Products</TabsTrigger>
                            <TabsTrigger value="categories">Categories</TabsTrigger>
                        </TabsList>
                        <TabsContent value="products" className="mt-4">
                            <div className="flex space-x-2 mb-4">
                                <div className="flex-grow">
                                    <Label htmlFor="search" className="sr-only">Search Products</Label>
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="search"
                                            placeholder="Search products..."
                                            className="pl-8"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(category => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" onClick={() => setIsBarcodeMode(!isBarcodeMode)}>
                                    {isBarcodeMode ? "Manual" : "Barcode"}
                                </Button>
                            </div>
                            {isBarcodeMode ? (
                                <form onSubmit={handleBarcodeSubmit} className="mb-4">
                                    <div className="flex space-x-2">
                                        <Input
                                            type="text"
                                            placeholder="Scan barcode..."
                                            value={barcodeInput}
                                            onChange={(e) => setBarcodeInput(e.target.value)}
                                            className="flex-grow"
                                        />
                                        <Button type="submit">Add</Button>
                                    </div>
                                </form>
                            ) : null}
                            <ScrollArea className="h-[calc(100vh-280px)]">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {filteredProducts.map(product => (
                                        <Card key={product.id} className="overflow-hidden">
                                            <CardHeader className="p-0">

                                                <Image width={100} height={100} src={product.image} alt={product.name} className="w-full h-32 object-cover" />
                                            </CardHeader>
                                            <CardContent className="p-4">
                                                <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                                                <Badge variant={product.stock > 0 ? "secondary" : "destructive"} className="mt-2">
                                                    {product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
                                                </Badge>
                                            </CardContent>
                                            <CardFooter className="p-2">
                                                <Button onClick={() => addToCart(branch, product, product.unit[0]._id, quantity)} className="w-full" disabled={product.stock === 0}>
                                                    <Plus className="h-4 w-4 mr-2" /> Add
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            </ScrollArea>
                            <div className="pt-4 flex gap-5">
                                <SuspendModal />
                                <OrderModal />
                                <AddExpensesModal />
                            </div>
                        </TabsContent>
                        <TabsContent value="categories">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {categories.map(category => (
                                    <Card key={category} className="overflow-hidden">
                                        <CardHeader>
                                            <CardTitle>{category}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">
                                                {products.filter(p => p.category === category).length} products
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="w-full md:w-1/3 bg-background p-4 shadow-lg overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center">

                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <ShoppingCart className="h-5 w-5 mr-2" /> Cart
                        </h2>
                        {branch.pricingType === 'automated' && (
                            <SellingGroup branch={branch} />
                        )}
                    </div>
                    {selectedCustomer && (
                        <div className="mb-4 p-2 bg-gray-100 rounded-md">
                            <p className="font-medium">{selectedCustomer.name}</p>
                            <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
                            <p className="text-sm">Loyalty Points: {selectedCustomer.loyaltyPoints}</p>
                        </div>
                    )}
                    <ScrollArea className="flex-grow mb-4">
                        {cartItems.length === 0 ? (
                            <p className="text-muted-foreground text-center py-8">Your cartItems is empty</p>
                        ) : (
                            <ul className="space-y-4">
                                {cartItems?.map(item => (
                                    <li key={item.id} className="flex items-center justify-between">
                                        <div className=" flex flex-col gap-4 items-center">
                                            <div className="flex items-center space-x-4">
                                                <Avatar>
                                                    <AvatarImage src={item.image} alt={item.name} />
                                                    <AvatarFallback>{item.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-muted-foreground">${branch.pricingType === 'manual' ? findManualPrice(item.item.manualPrice, (selectedUnit as string || item?.unit as string)).toFixed(2) : findAutomatedPrice(item.item, item.item.unit, item.unit as string, selectedValue as string).toFixed(2)}</p>
                                                </div>
                                            </div>
                                            <UnitSelect
                                                selectedUnit={item.unit || item.item.unit[0]._id}
                                                onUnitChange={(value) => {
                                                    updateUnit(item.id, value);
                                                }}
                                                units={item.item.unit}
                                            />
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </ScrollArea>
                    <Separator className="my-4" />
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Subtotal:</span>
                            <span>${(branch.pricingType === 'manual' ? subtotalManual.toFixed(2) : subtotalAutomated.toFixed(2))}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Label htmlFor="discount">Discount %:</Label>
                            <Input
                                id="discount"
                                type="number"
                                value={discountPercent}
                                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                                className="w-20"
                            />
                            <span className="text-sm text-muted-foreground">-${discount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center font-bold">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <Button className="w-full" onClick={() => setIsCheckoutDialogOpen(true)} disabled={cartItems.length === 0}>
                            Proceed to Checkout
                        </Button>
                    </div>
                </div>
            </main>

            <CheckoutModal total={total} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} isProcessingPayment={isProcessingPayment} isCheckoutDialogOpen={isCheckoutDialogOpen} setIsCheckoutDialogOpen={setIsCheckoutDialogOpen} handleCheckout={handleCheckout} />

            <TransactionHistoryModal isTransactionHistoryOpen={isTransactionHistoryOpen} transactions={transactions} setIsTransactionHistoryOpen={setIsTransactionHistoryOpen} />

            {showReceipt && (
                <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
                    <DialogContent>
                        <Receipt
                            items={cartItems}
                            customer={selectedCustomer}
                            subtotal={subtotalManual}
                            discount={discount}
                            total={total}
                            paymentMethod={paymentMethod}
                        />
                        <DialogFooter>
                            <Button onClick={() => {
                                setShowReceipt(false);
                                clearCart();
                            }}>
                                Close
                            </Button>
                            <Button onClick={() => {
                                // Implement print functionality here
                                window.print();
                            }}>
                                Print
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

