"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { ShoppingCart, Plus, Minus, X, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"
import TransactionHistoryModal from "./TransactionModal"
import CheckoutModal from "./CheckoutModal"
import UnitSelect from "./UnitSelect"
import { useCartStore } from "@/hooks/use-cart"
import { Receipt } from "./Receipt"

import { SellingGroup } from "./selling-group"
import { findAutomatedPrice, findManualPrice } from "@/lib/utils"
import { useSelectSellingGroup } from "@/hooks/use-select-selling-group"
import SuspendModal from "./SuspendModal"
import OrderModal from "./OrderModal"
import AddExpensesModal from "./AddExpenses"
import Navbar from "./Navbar"
import BrandSelection from "../commons/BrandSelection"
import CategorySelection from "../commons/CategorySelection"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Switch } from "../ui/switch"
import { fetchAllProductsForPos } from "@/lib/actions/product.actions"
import useCheckingStore from "@/hooks/use-checking-store"
import type { IBranch } from "@/lib/models/branch.models"

interface Product {
    id: number
    name: string
    price: number
    image: string
    inventory: number
    category: string
    barcode: string
    _id: string
    images: string[]
    unit: { _id: string; name: string }[]
    stock: number
}

interface CartItem {
    id: number
    name: string
    price: number
    image: string
    inventory: number
    category: string
    barcode: string
    quantity: number
    item: {
        manualPrice: { unitId: { _id: string; name: string }; price: number; tax: number }[]
        unit: { _id: string; name: string }[]
        retailPrice?: { retailSellingPrice: number; retailMarkupPercentage: number }
        wholesalePrice?: { wholesaleSellingPrice: number; wholesaleMarkupPercentage: number }
    }
    unit: string
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
    paymentMethod: "card" | "cash" | "gift" | "qr"
    discount: number
}

const customers: Customer[] = [
    {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        loyaltyPoints: 100,
        address: "123 Main St, Anytown, USA",
        phone: "555-1234",
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        loyaltyPoints: 50,
        address: "456 Elm St, Othertown, USA",
        phone: "555-5678",
    },
]

export default function PosContent({
    brands,
    categories,
    user,
    branches,
    branch,
    suspends,
}: { brands: IBrand[]; categories: ICategory[]; user: IUser; branches: IBranch[]; branch: IBranch; suspends: any[] }) {
    const {
        cartItems,
        discountPercent,
        updateUnit,
        addToCart,
        removeFromCart,
        updateQuantity,
        setDiscountPercent,
        clearCart,
    } = useCartStore()
    const { selectedValue } = useSelectSellingGroup()

    const [selectedBrand, setSelectedBrand] = useState<string>("")
    const [selectedCategory, setSelectedCategory] = useState<string>("")
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
    const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<"card" | "cash" | "gift" | "qr">("card")
    const [isProcessingPayment, setIsProcessingPayment] = useState(false)
    const [transactions, setTransactions] = useState<SaleTransaction[]>([])
    const [isTransactionHistoryOpen, setIsTransactionHistoryOpen] = useState(false)
    const [barcodeInput, setBarcodeInput] = useState("")
    const [quantity] = useState(1)
    const [selectedUnit, setSelectedUnit] = useState("")
    const [showReceipt, setShowReceipt] = useState(false)
    const [products, setProducts] = useState<Product[] | []>([])
    const { checking, setChecking } = useCheckingStore()

    const [searchTerm, setSearchTerm] = useState("")
    const [page, setPage] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const observer = useRef<IntersectionObserver | null>(null)
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

    const invoiceRef = useRef<HTMLDivElement>(null)

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }
    const handleSwitchChange = (checked: boolean) => {
        setChecking(checked)
    }
    const limit = 100
    const productSet = useRef<Set<string>>(new Set()) // Track unique product IDs

    const filterProducts = useCallback(
        (query: string) => {
            if (query.trim().length >= 2) {
                const filtered = products.filter((product) => product.name.toLowerCase().includes(query.trim().toLowerCase()))
                setFilteredProducts(filtered)
            } else {
                setFilteredProducts(products)
            }
        },
        [products],
    )

    useEffect(() => {
        filterProducts(searchTerm)
    }, [searchTerm, filterProducts])

    const lastProductElementRef = useCallback(
        (node: HTMLDivElement) => {
            if (loading) return
            if (observer.current) observer.current.disconnect()
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1)
                }
            })
            if (node) observer.current.observe(node)
        },
        [loading, hasMore],
    )

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const response = (await fetchAllProductsForPos(page, limit)) as { products: Product[]; total: number }
            const newProducts = response.products?.filter((product: Product) => !productSet.current.has(product._id)) || []

            // Add new product IDs to the set
            newProducts?.forEach((product: Product) => productSet.current.add(product._id))

            setProducts((prevProducts) => [...prevProducts, ...newProducts])
            setFilteredProducts((prevProducts) => [...prevProducts, ...newProducts])
            setHasMore(newProducts?.length > 0)
        } catch (error) {
            console.error("Error fetching products:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [page])

    // for manual price
    const subtotalManual = cartItems.reduce((sum, item) => {
        const manualPriceWithTax =
            item.item?.manualPrice?.map((price) => ({
                ...price,
                tax: price.tax || 0, // Ensure tax property is present
            })) || []
        const price = findManualPrice(manualPriceWithTax, item?.unit as string) || 0
        return sum + price * (item.quantity || 0)
    }, 0)
    const subtotalAutomated = cartItems.reduce((sum, item) => {
        if (!item?.item) return sum
        const price = findAutomatedPrice(
            {
                ...item.item,
                retailPrice: item.item.retailPrice
                    ? {
                        retailUnitCost: item.item.retailPrice?.retailSellingPrice,
                        retailMarkupPercentage: item.item.retailPrice?.retailMarkupPercentage,
                    }
                    : undefined,
                wholesalePrice: item.item.wholesalePrice
                    ? {
                        wholesaleUnitCost: item.item.wholesalePrice?.wholesaleSellingPrice,
                        wholesaleMarkupPercentage: item.item.wholesalePrice?.wholesaleMarkupPercentage,
                    }
                    : undefined,
            },
            item.item.unit as unknown as { _id: string; quantity: number }[],
            item.unit as string,
            selectedValue as string,
        )
        return sum + (price ?? 0) * (item.quantity || 0)
    }, 0)
    const subtotal = branch.inventorySettings.pricingType === "manual" ? subtotalManual : subtotalAutomated
    const discount = subtotal * (discountPercent / 100)
    const total = subtotal - discount

    // Functionality remains the same, just use Zustand actions/state
    const handleCheckout = async () => {
        setIsProcessingPayment(true)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        completeTransaction()
    }

    const completeTransaction = () => {
        setIsProcessingPayment(false)
        setIsCheckoutDialogOpen(false)

        const newTransaction: SaleTransaction = {
            id: transactions.length + 1,
            date: new Date(),
            customer: selectedCustomer,
            items: [...cartItems],
            total: total,
            paymentMethod: paymentMethod,
            discount: discount,
        }

        setTransactions([...transactions, newTransaction])

        toast({
            title: "Payment Successful",
            description: `Total amount: }`,
        })

        setShowReceipt(true)
    }

    const handleBarcodeSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const product = products.find((p) => p.barcode === barcodeInput)
        if (product) {
            addToCart(branch, product, product.unit[0]._id, quantity)
            setBarcodeInput("")
        } else {
            toast({
                title: "Product Not Found",
                description: "No product matches the entered barcode.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <Navbar
                products={suspends}
                branches={branches}
                user={user}
                customers={customers}
                setSelectedCustomer={setSelectedCustomer}
                setIsTransactionHistoryOpen={setIsTransactionHistoryOpen}
            />
            <main className="flex-grow flex flex-col md:flex-row overflow-hidden bg-background">
                <div className="w-full md:w-2/3 p-4 ">
                    <div className="max-w-xl mx-auto  p-2 sticky top-0 z-30">
                        <div className="flex gap-4 items-center">
                            {checking ? (
                                <div className="w-full flex gap-4">
                                    <div>
                                        <BrandSelection SelectedBrand={(value) => setSelectedBrand(value)} brands={brands} />
                                    </div>
                                    <div>
                                        <CategorySelection
                                            SelectedCategory={(value) => setSelectedCategory(value)}
                                            categories={categories}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full">
                                    <Input
                                        type="text"
                                        id="search"
                                        placeholder="Search product by name/sku/barcode"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                            )}
                            <div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="bg-white p-1 shadow-lg rounded-md items-center text-center">
                                                <Switch checked={checking} onCheckedChange={handleSwitchChange} />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Filter Products by Brand name and Category</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    </div>

                    <ScrollArea className="h-[calc(100vh-200px)]">
                        {filteredProducts.length !== 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {filteredProducts.map((product) => (
                                    <Card key={product.id} className="overflow-hidden">
                                        <CardHeader className="p-0">
                                            <Image
                                                width={100}
                                                height={100}
                                                src={product.images[0] ?? "/sardine.jpg"}
                                                alt={product.name}
                                                className="w-full h-24 object-scale-down"
                                            />
                                        </CardHeader>
                                        <CardContent className="p-2">
                                            <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                                            <Badge variant={product.stock > 0 ? "secondary" : "destructive"} className="mt-2">
                                                {product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
                                            </Badge>
                                        </CardContent>
                                        <CardFooter className="p-2">
                                            <Button
                                                onClick={() => addToCart(branch, product, product.unit ? product.unit[0]._id : "", quantity)}
                                                className="w-full"
                                                disabled={product.stock === 0}
                                            >
                                                <Plus className="h-4 w-4 mr-2" /> Add
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            !loading && (
                                <div className="flex flex-col items-center justify-center h-[calc(100vh-500px)]  ">
                                    <p className="text-center text-sm">No products found.</p>
                                    <p className="text-center text-sm text-muted-foreground">
                                        Try adjusting your search or filter to find what you&apos;re looking for.
                                    </p>
                                </div>
                            )
                        )}
                        {loading && (
                            <div
                                className="flex flex-col items-center justify-center min-h-[calc(100vh-500px)] space-y-3 bg-gray-50"
                                aria-busy="true"
                                aria-live="polite"
                            >
                                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                <p className="text-base font-semibold text-gray-700">Loading products...</p>
                                <p className="text-sm text-gray-500">Please wait while we load your content.</p>
                            </div>
                        )}
                    </ScrollArea>
                    <div className="flex gap-5">
                        <SuspendModal branch={branch} />
                        <OrderModal />
                        <AddExpensesModal />
                    </div>
                </div>

                <div className="w-full md:w-1/3 bg-background p-4 shadow-lg overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <ShoppingCart className="h-5 w-5 mr-2" /> Cart
                        </h2>
                        {branch.inventorySettings.pricingType === "automated" && <SellingGroup branch={branch} />}
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
                                {cartItems?.map((item) => (
                                    <li key={item.id} className="flex items-center justify-between">
                                        <div className=" flex flex-col gap-4 items-center">
                                            <div className="flex items-center space-x-4">
                                                <Avatar>
                                                    <AvatarImage src={item.image} alt={item.name} />
                                                    <AvatarFallback>{item.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{item?.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        &#x20B5;
                                                        {(branch.inventorySettings.pricingType === "manual"
                                                            ? (findManualPrice(
                                                                item.item?.manualPrice,
                                                                (selectedUnit as string) || (item?.unit as string),
                                                            )|| 0).toFixed(2)
                                                            : (findAutomatedPrice(
                                                                item?.item,
                                                                item.item?.unit,
                                                                item?.unit as string,
                                                                selectedValue as string,
                                                            )|| 0).toFixed(2)) }
                                                    </p>
                                                </div>
                                            </div>
                                            <UnitSelect
                                                selectedUnit={item.unit || item.item.unit[0]._id}
                                                onUnitChange={(value) => {
                                                    updateUnit(item.id, value)
                                                }}
                                                units={item.item.unit}
                                            />
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
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
                            <span>
                                &#x20B5;
                                {(branch.inventorySettings.pricingType === "manual"
                                    ? (subtotalManual || 0).toFixed(2)
                                    : (subtotalAutomated || 0).toFixed(2))}
                            </span>
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
                            <span className="text-sm text-muted-foreground">-&#x20B5;{(discount || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center font-bold">
                            <span>Total:</span>
                            <span>&#x20B5;{(total || 0).toFixed(2)}</span>
                        </div>
                        <Button className="w-full" onClick={() => setIsCheckoutDialogOpen(true)} disabled={cartItems.length === 0}>
                            Proceed to Checkout
                        </Button>
                    </div>
                </div>
            </main>

            <CheckoutModal
                total={total}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                isProcessingPayment={isProcessingPayment}
                isCheckoutDialogOpen={isCheckoutDialogOpen}
                setIsCheckoutDialogOpen={setIsCheckoutDialogOpen}
                handleCheckout={handleCheckout}
            />

            <TransactionHistoryModal
                isTransactionHistoryOpen={isTransactionHistoryOpen}
                transactions={transactions}
                setIsTransactionHistoryOpen={setIsTransactionHistoryOpen}
            />

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
                            <Button
                                onClick={() => {
                                    setShowReceipt(false)
                                    clearCart()
                                }}
                            >
                                Close
                            </Button>
                            <Button
                                onClick={() => {
                                    // Implement print functionality here
                                    window.print()
                                }}
                            >
                                Print
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

