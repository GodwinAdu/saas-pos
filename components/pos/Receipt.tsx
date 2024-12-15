import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { findManualPrice } from "@/lib/utils"



interface ReceiptProps {
  items: any[]
  customer: any | null
  subtotal: number
  discount: number
  total: number
  paymentMethod: string
}

export function Receipt({ items, customer, subtotal, discount, total, paymentMethod }: ReceiptProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Receipt</h2>
      <p className="mb-2">Date: {new Date().toLocaleString()}</p>
      <p className="mb-4">Customer: {customer?.name || 'Guest'}</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.item.manualPrice?.unitId?.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>${findManualPrice(item.item.manualPrice,item.unit).toFixed(2)}</TableCell>
              <TableCell>${(item.quantity * findManualPrice(item.item.manualPrice,item.unit)).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4">
        <p className="flex justify-between"><span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span></p>
        <p className="flex justify-between"><span>Discount:</span> <span>${discount.toFixed(2)}</span></p>
        <p className="flex justify-between font-bold"><span>Total:</span> <span>${total.toFixed(2)}</span></p>
        <p className="flex justify-between mt-2"><span>Payment Method:</span> <span>{paymentMethod}</span></p>
      </div>
    </div>
  )
}

