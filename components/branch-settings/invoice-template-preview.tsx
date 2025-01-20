import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface InvoiceTemplatePreviewProps {
  template: 'standard' | 'modern' | 'minimal'
}

const dummyInvoiceData = {
  invoiceNumber: 'INV-001',
  date: '2023-05-15',
  dueDate: '2023-06-14',
  companyName: 'TechNova Solutions',
  companyAddress: '123 Innovation Avenue, Silicon Valley, CA 94000',
  companyEmail: 'billing@technovasolutions.com',
  companyPhone: '+1 (555) 123-4567',
  customerName: 'Alex Johnson',
  customerCompany: 'Global Enterprises Inc.',
  customerAddress: '456 Corporate Plaza, New York, NY 10001',
  items: [
    { description: 'Web Development Services', quantity: 1, price: 5000, total: 5000 },
    { description: 'UI/UX Design', quantity: 1, price: 3000, total: 3000 },
    { description: 'SEO Optimization', quantity: 1, price: 1500, total: 1500 },
  ],
  subtotal: 9500,
  tax: 950,
  total: 10450,
}

export function InvoiceTemplatePreview({ template }: InvoiceTemplatePreviewProps) {
  const renderStandardTemplate = () => (
    <div className="space-y-8 p-8 bg-white text-gray-900">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-blue-600">{dummyInvoiceData.companyName}</h2>
          <p className="text-sm mt-1">{dummyInvoiceData.companyAddress}</p>
          <p className="text-sm">{dummyInvoiceData.companyEmail}</p>
          <p className="text-sm">{dummyInvoiceData.companyPhone}</p>
        </div>
        <div className="text-right">
          <h3 className="text-2xl font-semibold text-gray-700">Invoice</h3>
          <p className="text-sm mt-1">Invoice #: {dummyInvoiceData.invoiceNumber}</p>
          <p className="text-sm">Date: {dummyInvoiceData.date}</p>
          <p className="text-sm">Due Date: {dummyInvoiceData.dueDate}</p>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Bill To:</h4>
          <p className="font-medium">{dummyInvoiceData.customerName}</p>
          <p>{dummyInvoiceData.customerCompany}</p>
          <p className="text-sm">{dummyInvoiceData.customerAddress}</p>
        </div>
        <div className="text-right">
          <Badge variant="outline" className="mb-2">Payment Due: {dummyInvoiceData.dueDate}</Badge>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="font-semibold">Description</TableHead>
            <TableHead className="font-semibold text-right">Quantity</TableHead>
            <TableHead className="font-semibold text-right">Price</TableHead>
            <TableHead className="font-semibold text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dummyInvoiceData.items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.description}</TableCell>
              <TableCell className="text-right">{item.quantity}</TableCell>
              <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
              <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end">
        <div className="w-1/3 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${dummyInvoiceData.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (10%):</span>
            <span>${dummyInvoiceData.tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span>${dummyInvoiceData.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="mt-8 text-sm text-gray-600">
        <p>Thank you for your business. Please make payment within 30 days.</p>
        <p>Bank transfer details: IBAN: US00 0000 0000 0000 0000 0000</p>
      </div>
    </div>
  )

  const renderModernTemplate = () => (
    <div className="space-y-8 p-8 bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-4xl font-bold text-blue-600">{dummyInvoiceData.companyName}</h2>
          <p className="text-sm mt-2 text-gray-600">{dummyInvoiceData.companyAddress}</p>
          <p className="text-sm text-gray-600">{dummyInvoiceData.companyEmail}</p>
          <p className="text-sm text-gray-600">{dummyInvoiceData.companyPhone}</p>
        </div>
        <div className="text-right">
          <h3 className="text-3xl font-bold text-blue-600">Invoice</h3>
          <Badge variant="secondary" className="mt-2">#{dummyInvoiceData.invoiceNumber}</Badge>
          <p className="text-sm mt-2">Issued: {dummyInvoiceData.date}</p>
          <p className="text-sm">Due: {dummyInvoiceData.dueDate}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-md">
        <div>
          <h4 className="font-semibold text-blue-600 mb-2">Bill To:</h4>
          <p className="font-medium">{dummyInvoiceData.customerName}</p>
          <p>{dummyInvoiceData.customerCompany}</p>
          <p className="text-sm text-gray-600">{dummyInvoiceData.customerAddress}</p>
        </div>
        <div className="text-right">
          <h4 className="font-semibold text-blue-600 mb-2">Payment Due:</h4>
          <p className="text-xl font-bold">{dummyInvoiceData.dueDate}</p>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-blue-600 text-white">
            <TableHead className="font-semibold">Description</TableHead>
            <TableHead className="font-semibold text-right">Quantity</TableHead>
            <TableHead className="font-semibold text-right">Price</TableHead>
            <TableHead className="font-semibold text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dummyInvoiceData.items.map((item, index) => (
            <TableRow key={index} className="bg-white">
              <TableCell>{item.description}</TableCell>
              <TableCell className="text-right">{item.quantity}</TableCell>
              <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
              <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end">
        <div className="w-1/3 space-y-2 bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${dummyInvoiceData.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (10%):</span>
            <span>${dummyInvoiceData.tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg text-blue-600">
            <span>Total:</span>
            <span>${dummyInvoiceData.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="mt-8 text-sm text-gray-600 bg-white p-4 rounded-lg shadow-md">
        <p className="font-semibold text-blue-600 mb-2">Payment Terms:</p>
        <p>Please make payment within 30 days. Thank you for your business!</p>
        <p className="mt-2">Bank transfer details: IBAN: US00 0000 0000 0000 0000 0000</p>
      </div>
    </div>
  )

  const renderMinimalTemplate = () => (
    <div className="space-y-8 p-8 bg-white text-gray-900">
      <div className="flex justify-between items-start">
        <h2 className="text-4xl font-light text-gray-700">{dummyInvoiceData.companyName}</h2>
        <div className="text-right">
          <h3 className="text-2xl font-light text-gray-700">Invoice #{dummyInvoiceData.invoiceNumber}</h3>
          <p className="text-sm text-gray-500 mt-1">Issued: {dummyInvoiceData.date}</p>
        </div>
      </div>
      <Separator className="my-8" />
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">From:</h4>
          <p>{dummyInvoiceData.companyName}</p>
          <p className="text-sm text-gray-500">{dummyInvoiceData.companyAddress}</p>
          <p className="text-sm text-gray-500">{dummyInvoiceData.companyEmail}</p>
          <p className="text-sm text-gray-500">{dummyInvoiceData.companyPhone}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">To:</h4>
          <p>{dummyInvoiceData.customerName}</p>
          <p>{dummyInvoiceData.customerCompany}</p>
          <p className="text-sm text-gray-500">{dummyInvoiceData.customerAddress}</p>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-light text-gray-500">Description</TableHead>
            <TableHead className="font-light text-gray-500 text-right">Quantity</TableHead>
            <TableHead className="font-light text-gray-500 text-right">Price</TableHead>
            <TableHead className="font-light text-gray-500 text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dummyInvoiceData.items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.description}</TableCell>
              <TableCell className="text-right">{item.quantity}</TableCell>
              <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
              <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end">
        <div className="w-1/3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal:</span>
            <span>${dummyInvoiceData.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tax (10%):</span>
            <span>${dummyInvoiceData.tax.toFixed(2)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between text-lg">
            <span className="font-medium text-gray-700">Total:</span>
            <span className="font-medium text-gray-700">${dummyInvoiceData.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="mt-8 text-sm text-gray-500">
        <p>Payment due by: {dummyInvoiceData.dueDate}</p>
        <p className="mt-2">Bank transfer details: IBAN: US00 0000 0000 0000 0000 0000</p>
        <p className="mt-4">Thank you for your business.</p>
      </div>
    </div>
  )

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-0">
        {template === 'standard' && renderStandardTemplate()}
        {template === 'modern' && renderModernTemplate()}
        {template === 'minimal' && renderMinimalTemplate()}
      </CardContent>
    </Card>
  )
}

