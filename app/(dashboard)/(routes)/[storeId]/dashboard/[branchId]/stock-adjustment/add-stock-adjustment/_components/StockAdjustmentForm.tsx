'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Trash2 } from 'lucide-react'

interface Product {
  id: string
  name: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export default function StockAdjustmentForm() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  
  const totalAmount = products.reduce((sum, product) => sum + product.subtotal, 0)

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Add Stock Adjustment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Business Location:*</Label>
            <Select>
              <SelectTrigger id="location">
                <SelectValue placeholder="Please Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">Main Warehouse</SelectItem>
                <SelectItem value="branch1">Branch 1</SelectItem>
                <SelectItem value="branch2">Branch 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Reference No:</Label>
            <Input id="reference" placeholder="Reference number" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date:*</Label>
            <Input 
              id="date" 
              type="datetime-local" 
              defaultValue={new Date().toISOString().slice(0, 16)} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adjustment-type">Adjustment type:*</Label>
            <Select>
              <SelectTrigger id="adjustment-type">
                <SelectValue placeholder="Please Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="abnormal">Abnormal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Search Products</h3>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products for stock adjustment"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No products added
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>{product.subtotal.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setProducts(products.filter((p) => p.id !== product.id))
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex justify-end">
            <p className="text-lg font-semibold">
              Total Amount: {totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="total-recovered">Total amount recovered:</Label>
            <Input 
              id="total-recovered" 
              type="number" 
              defaultValue="0"
              min="0"
              step="0.01" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason:</Label>
            <Textarea 
              id="reason" 
              placeholder="Reason"
              className="min-h-[100px]" 
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

