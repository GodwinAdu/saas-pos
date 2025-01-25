import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

interface Transaction {
    id: string;
    date: Date;
    customer?: { name: string };
    total: number;
    paymentMethod: string;
}

interface TransactionHistoryModalProps {
    isTransactionHistoryOpen: boolean;
    setIsTransactionHistoryOpen: (open: boolean) => void;
    transactions: Transaction[];
}

const TransactionHistoryModal: React.FC<TransactionHistoryModalProps> = ({isTransactionHistoryOpen, setIsTransactionHistoryOpen, transactions}) => {
    return (
        <Dialog open={isTransactionHistoryOpen} onOpenChange={setIsTransactionHistoryOpen}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Transaction History</DialogTitle>
                </DialogHeader>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Payment Method</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>{transaction.id}</TableCell>
                                <TableCell>{transaction.date.toLocaleString()}</TableCell>
                                <TableCell>{transaction.customer?.name || 'Guest'}</TableCell>
                                <TableCell>${transaction.total || 0}</TableCell>
                                <TableCell>{transaction.paymentMethod}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    )
}

export default TransactionHistoryModal
