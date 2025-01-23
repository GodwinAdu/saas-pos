import CustomerDemographics from '@/components/commons/dashboard/customer-demographic'
import DailySalesTrend from '@/components/commons/dashboard/daily-sales-trend'
import EmployeePerformance from '@/components/commons/dashboard/employee-performance'
import HeatmapAnalysis from '@/components/commons/dashboard/heat-map-analytic'
import InventoryStatus from '@/components/commons/dashboard/inventory-status'
import MetricsGrid from '@/components/commons/dashboard/metric-grid'
import PredictiveAnalytics from '@/components/commons/dashboard/predictive-analytic'
import RealTimeUpdates from '@/components/commons/dashboard/real-time-updates'
import RecentTransactions from '@/components/commons/dashboard/recent-transaction'
import SalesByCategory from '@/components/commons/dashboard/sale-by-category'
import TodayTransactions from '@/components/commons/dashboard/today-transaction'
import TopSellingProducts from '@/components/commons/dashboard/top-selling-products'
import TransactionHistory from '@/components/commons/dashboard/transaction-history'
import TrashItemsCount from '@/components/commons/dashboard/trash-item-count'
import { fetchStoreById } from '@/lib/actions/store.actions'
import { redirect } from 'next/navigation'


const page = async ({ params }: { params: StoreIdParams }) => {
  const { storeId } = await params;

  const store = await fetchStoreById(storeId);

  if (!store) {
    redirect('/')
  }

  if (store.banned) {
    redirect(`/banned-store/${storeId}`)
  }

  return (
    <main className="flex-1 p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      <MetricsGrid />
      <RealTimeUpdates />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TodayTransactions />
        <TrashItemsCount />
        <TransactionHistory />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <RecentTransactions />
        <InventoryStatus />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <SalesByCategory />
        <TopSellingProducts />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <CustomerDemographics />
        <DailySalesTrend />
      </div>
      <EmployeePerformance />
      <PredictiveAnalytics />
      <HeatmapAnalysis />
    </main>
  )
}

export default page
