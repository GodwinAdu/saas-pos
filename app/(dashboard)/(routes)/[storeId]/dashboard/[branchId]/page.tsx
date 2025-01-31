import CustomerDemographics from '@/components/commons/dashboard/customer-demographic'
import DailySalesTrend from '@/components/commons/dashboard/daily-sales-trend'
import EmployeePerformance from '@/components/commons/dashboard/employee-performance'
import HeatmapAnalysis from '@/components/commons/dashboard/heat-map-analytic'
import InventoryStatus from '@/components/commons/dashboard/inventory-status'
import MetricsGrid from '@/components/commons/dashboard/metric-grid'
import MonthlySales from '@/components/commons/dashboard/monthly-sales'
import PredictiveAnalytics from '@/components/commons/dashboard/predictive-analytic'
import RealTimeUpdates from '@/components/commons/dashboard/real-time-updates'
import RecentTransactions from '@/components/commons/dashboard/recent-transaction'
import SalesByCategory from '@/components/commons/dashboard/sale-by-category'
import TodayTransactions from '@/components/commons/dashboard/today-transaction'
import TopSellingProducts from '@/components/commons/dashboard/top-selling-products'
import TransactionHistory from '@/components/commons/dashboard/transaction-history'
import TrashItemsCount from '@/components/commons/dashboard/trash-item-count'
import { Separator } from '@/components/ui/separator'
import { fetchCurrentMonthRevenue } from '@/lib/actions/revenue-summary.actions'
import { calculateProfitOrLoss, getTodaySales, getTopProductsOfCurrentMonth } from '@/lib/actions/sale.actions'
import { fetchStoreById } from '@/lib/actions/store.actions'
import { getCurrencySymbol, paymentMethods } from '@/lib/settings/store.settings'
import { redirect } from 'next/navigation'


const page = async ({ params }: { params: StoreIdParams }) => {
  const { storeId } = await params;

  const store = await fetchStoreById(storeId);
  const todaySales = await getTodaySales()
  const topProducts = await getTopProductsOfCurrentMonth()
  const totalRevenue = await fetchCurrentMonthRevenue()
  const currency = await getCurrencySymbol()
  const payment = await paymentMethods()
  const profit = await calculateProfitOrLoss()
  console.log(topProducts,"top products")
  console.log(todaySales,"today sales")
  console.log(totalRevenue,"total revenue")
  console.log(currency,"currency")
  console.log(payment,"payment")
  console.log(profit,"profit")

  if (!store) {
    redirect('/')
  }

  if (store.banned) {
    redirect(`/banned-store/${storeId}`)
  }

  return (
    <main className="flex-1 p-4 space-y-2">
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Overview</h1>
      <p className="text-2xl font-bold">{new Date().getFullYear()}</p>
    </div>
    <Separator />
      <MetricsGrid />
      <MonthlySales />
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
