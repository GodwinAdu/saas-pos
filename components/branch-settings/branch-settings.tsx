'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import GeneralSettings from './general-settings'
import InventorySettings from './inventory-settings'
import SalesSettings from './sales-settings'
import ReportingSettings from './reporting-settings'
import { InvoiceSettings } from './invoice-settings'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { IBranch } from '@/lib/models/branch.models'


export default function BranchSettings({ branch }: { branch: IBranch }) {
  const [activeTab, setActiveTab] = useState('general')
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showDeactivateConfirmation, setShowDeactivateConfirmation] = useState(false)
  const [showResetConfirmation, setShowResetConfirmation] = useState(false)
  const [showMergeConfirmation, setShowMergeConfirmation] = useState(false)
  const [showTransferConfirmation, setShowTransferConfirmation] = useState(false)
  const [mergeBranchName, setMergeBranchName] = useState('')
  const [transferEmployeeCount, setTransferEmployeeCount] = useState(0)

  const handleDeleteBranch = () => {
    // Perform delete action here
    toast({
      title: "Branch has been deleted",
      description: "This action cannot be undone.",
      variant: "destructive",
    })
    setShowDeleteConfirmation(false)
  }

  const handleDeactivateBranch = () => {
    // Perform deactivate action here
    toast({
      title: "Branch has been deactivated",
      description: "The branch can be reactivated later if needed.",
      variant: "default",
    })
    setShowDeactivateConfirmation(false)
  }

  const handleResetBranch = () => {
    // Perform reset action here
    toast({
      title: "Branch has been reset",
      description: "All branch data has been reset to default values.",
      variant: "destructive",
    })
    setShowResetConfirmation(false)
  }

  const handleMergeBranch = () => {
    // Perform merge action here
    toast({
      title: "Branch merge initiated",
      description: `Merging process started with ${mergeBranchName}.`,
      variant: "default",
    })
    setShowMergeConfirmation(false)
  }

  const handleTransferEmployees = () => {
    // Perform employee transfer action here
    toast({
      title: "Employee transfer initiated",
      description: `${transferEmployeeCount} employees will be transferred to other branches.`,
      variant: "default",
    })
    setShowTransferConfirmation(false)
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7 mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="reporting">Reporting</TabsTrigger>
              <TabsTrigger value="invoice">Invoice</TabsTrigger>
              <TabsTrigger value="danger" className="bg-red-500 text-white">Danger Zone</TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="general">
                  <GeneralSettings branch={branch} />
                </TabsContent>
                <TabsContent value="inventory">
                  <InventorySettings branch={branch} />
                </TabsContent>
                <TabsContent value="sales">
                  <SalesSettings branch={branch} />
                </TabsContent>
                <TabsContent value="reporting">
                  <ReportingSettings branch={branch} />
                </TabsContent>
                <TabsContent value="invoice">
                  <InvoiceSettings branch={branch} />
                </TabsContent>
                <TabsContent value="danger">
                  <div className="space-y-6">
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Warning</AlertTitle>
                      <AlertDescription>
                        The actions in this section can have severe consequences. Proceed with extreme caution.
                      </AlertDescription>
                    </Alert>
                    <div className="grid gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <h3 className="text-lg font-semibold mb-2">Deactivate Branch</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Temporarily disable this branch. This will prevent any new orders or operations.
                          </p>
                          <Button variant="outline" onClick={() => setShowDeactivateConfirmation(true)}>
                            Deactivate Branch
                          </Button>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <h3 className="text-lg font-semibold mb-2">Reset Branch Data</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Reset all branch data to default values. This includes inventory, sales history, and customer data.
                          </p>
                          <Button variant="outline" onClick={() => setShowResetConfirmation(true)}>
                            Reset Branch Data
                          </Button>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <h3 className="text-lg font-semibold mb-2">Merge Branch</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Merge this branch with another existing branch. All data will be combined.
                          </p>
                          <div className="flex items-center space-x-2">
                            <Input
                              placeholder="Enter branch name to merge"
                              value={mergeBranchName}
                              onChange={(e) => setMergeBranchName(e.target.value)}
                            />
                            <Button variant="outline" onClick={() => setShowMergeConfirmation(true)}>
                              Merge Branch
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <h3 className="text-lg font-semibold mb-2">Transfer Employees</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Transfer employees from this branch to other branches.
                          </p>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              placeholder="Number of employees"
                              value={transferEmployeeCount}
                              onChange={(e) => setTransferEmployeeCount(parseInt(e.target.value))}
                            />
                            <Button variant="outline" onClick={() => setShowTransferConfirmation(true)}>
                              Transfer Employees
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <h3 className="text-lg font-semibold mb-2">Delete Branch</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Permanently delete this branch and all associated data. This action cannot be undone.
                          </p>
                          <Button variant="destructive" onClick={() => setShowDeleteConfirmation(true)}>
                            Delete Branch
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the branch
              and all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBranch} className="bg-red-500 hover:bg-red-600">
              Yes, delete branch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeactivateConfirmation} onOpenChange={setShowDeactivateConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Branch Deactivation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate this branch? This will temporarily halt all operations for this location.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivateBranch} className="bg-yellow-500 hover:bg-yellow-600">
              Yes, deactivate branch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showResetConfirmation} onOpenChange={setShowResetConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Branch Data?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all branch data to default values. This includes inventory, sales history, and customer data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetBranch} className="bg-yellow-500 hover:bg-yellow-600">
              Yes, reset branch data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showMergeConfirmation} onOpenChange={setShowMergeConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Merge Branch?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to merge this branch with {mergeBranchName}? This will combine all data and operations. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleMergeBranch} className="bg-blue-500 hover:bg-blue-600">
              Yes, merge branches
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showTransferConfirmation} onOpenChange={setShowTransferConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Transfer Employees?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to transfer {transferEmployeeCount} employees to other branches? This will affect staffing and operations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleTransferEmployees} className="bg-green-500 hover:bg-green-600">
              Yes, transfer employees
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

