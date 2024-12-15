"use client"

import {
  BookOpen,
  Bot,
  Frame,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Users,
  ChevronRight,
  type LucideIcon,
  ShoppingBag,
  Coins,
  HandCoins,
  SendToBack,
  Blocks,
  Banknote,
  PiggyBank,
  Activity,
  Phone
} from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  url: string;
  icon?: React.ComponentType;
  roleField?: string;
  isActive?: boolean;
  items?: NavItem[];
}

interface NavMainProps {
  role: IRole;
}

export function NavMain({ role }: NavMainProps) {

  const params = useParams();
  const pathname = usePathname();

  const [openGroup, setOpenGroup] = useState<string | null>(null)

  const isActive = useCallback(
    (url: string) => pathname.startsWith(url),
    [pathname]
  );


  const storeId = params?.storeId as string;

  const branchId = params?.branchId as string;

  const navMain: NavItem[] = [
    {
      title: "Users",
      url: "#",
      icon: Users,
      isActive: true,
      roleField: "user",
      items: [
        {
          title: "Departments",
           url: `/${storeId}/dashboard/${branchId}/users/department`,
          roleField: "manageRole"
        },
        {
          title: "Manage Roles",
          url: `/${storeId}/dashboard/${branchId}/users/manage-role`,
          roleField: "manageRole"
        },
        {
          title: "Manage User",
          url: `/${storeId}/dashboard/${branchId}/users/manage-user`,
          roleField: "manageUser"
        }, 
      ],
    },
    {
      title: "Products",
      url: "#",
      icon: ShoppingBag,
      isActive: true,
      roleField: "product",
      items: [
        {
          title: "List Products",
          url: `/${storeId}/dashboard/${branchId}/products/list-products`,
          roleField: "listProduct"
        },
        {
          title: "Add Products",
          url: `/${storeId}/dashboard/${branchId}/products/add-products`,
          roleField: "manageProduct"
        },
        {
          title: "Units",
          url: `/${storeId}/dashboard/${branchId}/products/units`,
          roleField: "manageUnit"
        },
        {
          title: "Brands",
          url: `/${storeId}/dashboard/${branchId}/products/brands`,
          roleField: "manageCategory"
        },
        {
          title: "Categories",
          url: `/${storeId}/dashboard/${branchId}/products/categories`,
          roleField: "manageCategory"
        },
        {
          title: "Print Labels",
          url: `/${storeId}/dashboard/${branchId}/products/print-labels`,
          roleField: "managePrintLabel"
        },
        {
          title: "Variations",
          url: `/${storeId}/dashboard/${branchId}/products/variations`,
          roleField: "manageVariation"
        },
        {
          title: "Import Products",
          url: `/${storeId}/dashboard/${branchId}/products/import-products`,
          roleField: "manageImportProduct"
        },
        {
          title: "Selling group price",
          url: `/${storeId}/dashboard/${branchId}/products/selling-group-price`,
          roleField: "manageSellingGroupPrice"
        },
        {
          title: "Warrants",
          url: `/${storeId}/dashboard/${branchId}/products/warrants`,
          roleField: "manageWarrant"
        }
      ],
    },
    {
      title: "Sales",
      url: "#",
      icon: Coins,
      roleField: "sales",
      items: [
        {
          title: "All Sales",
          url: `/${storeId}/dashboard/${branchId}/sales/all-sales`,
          roleField: "manageAllSales"
        },
        {
          title: "Add Sales",
          url: `/${storeId}/dashboard/${branchId}/sales/add-sales`,
          roleField: "manageSales"
        },
        {
          title: "POS",
          url: `/pos/${branchId}`,
          roleField: "manageOrder"
        },
        {
          title: "Add Orders",
          url: `/${storeId}/dashboard/${branchId}/sales/add-order`,
          roleField: "manageOrder"
        },
        {
          title: "List Orders",
          url: `/${storeId}/dashboard/${branchId}/sales/list-orders`,
          roleField: "listOrder"
        },
        {
          title: "List Sell Return",
          url: `/${storeId}/dashboard/${branchId}/sales/list-sell-return`,
          roleField: "listSellReturn"
        },
        {
          title: "Shipment",
          url: `/${storeId}/dashboard/${branchId}/sales/shipment`,
          roleField: "manageShipment"
        },
        {
          title: "Discount",
          url: `/${storeId}/dashboard/${branchId}/sales/discount`,
          roleField: "manageDiscount"
        },
        {
          title: "Import Sales",
          url: `/${storeId}/dashboard/${branchId}/sales/import-sales`,
          roleField: "importSales"
        }
      ],
    },
    {
      title: "Purchase",
      url: "#",
      icon: HandCoins,
      roleField: "purchase",
      items: [
        {
          title: "List Purchase",
          url: `/${storeId}/dashboard/${branchId}/purchase/list-purchase`,
          roleField: "listPurchase"
        },
        {
          title: "Add Purchase",
          url: `/${storeId}/dashboard/${branchId}/purchase/add-purchase`,
          roleField: "managePurchase"
        },
        {
          title: "List Purchase Return",
          url: `/${storeId}/dashboard/${branchId}/purchase/list-purchase-return`,
          roleField: "listPurchaseReturn"
        },
        {
          title: "Import Purchase",
          url: `/${storeId}/dashboard/${branchId}/purchase/import-purchase`,
          roleField: "importPurchase"
        }
      ],
    },
    {
      title: "Stock Transfers",
      url: "#",
      icon: SendToBack,
      roleField: "stockTransfer",
      items: [
        {
          title: "List Stock Transfers",
          url: `/${storeId}/dashboard/${branchId}/stock-transfers/add-stock-transfers`,
          roleField: "listStockTransfer"
        },
        {
          title: "Add Stock Transfer",
          url: `/${storeId}/dashboard/${branchId}/stock-transfers/list-stock-transfer`,
          roleField: "manageStockTransfer"
        }
      ],
    },
    {
      title: "Stock Adjustments",
      url: "#",
      icon: Blocks,
      roleField: "stockAdjustment",
      items: [
        {
          title: "List Stock Adjustments",
          url: `/${storeId}/dashboard/${branchId}/stock-adjustment/list-stock-adjustments`,
          roleField: "listStockAdjustment"
        },
        {
          title: "Add Stock Adjustment",
          url: `/${storeId}/dashboard/${branchId}/stock-adjustment/add-stock-adjustment`,
          roleField: "manageStockAdjustment"
        }
      ],
    },
    {
      title: "Expenses",
      url: "#",
      icon: Banknote,
      roleField: "expenses",
      items: [
        {
          title: "Expenses Categories",
          url: `/${storeId}/dashboard/${branchId}/expenses/expenses-categories`,
          roleField: "manageExpensesCategory"
        },
        {
          title: "Add Expenses",
          url: `/${storeId}/dashboard/${branchId}/expenses/add-expenses`,
          roleField: "manageExpenses"
        }, {
          title: "List Expenses",
          url: `/${storeId}/dashboard/${branchId}/expenses/list-expenses`,
          roleField: "listExpenses"
        }
      ],
    },
    {
      title: "Payment Accounts",
      url: "#",
      icon: PiggyBank,
      roleField: "paymentAccount",
      items: [
        {
          title: "List Accounts",
          url: `/${storeId}/dashboard/${branchId}/payment-accounts/list-accounts`,
          roleField: "manageListAccount"
        },
        {
          title: "Balance Sheet",
          url: `/${storeId}/dashboard/${branchId}/payment-accounts/balance-sheet`,
          roleField: "balanceSheet"
        }, {
          title: "Trial Balance",
          url: `/${storeId}/dashboard/${branchId}/payment-accounts/trial-balance`,
          roleField: "trialBalance"
        }, {
          title: "Cash Flow",
          url: `/${storeId}/dashboard/${branchId}/payment-accounts/cash-flow`,
          roleField: "cashFlow"
        }, {
          title: "Payment Account Report",
          url: `/${storeId}/dashboard/${branchId}/payment-accounts/payment-account-report`,
          roleField: "paymentAccountReport"
        }
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: Activity,
      roleField: "report",
      items: [
        {
          title: "Profit/Lost Report",
          url: `/${storeId}/dashboard/${branchId}/report/profit-lost-report`,
          roleField: "profitLostReport"
        },
        {
          title: "Items Report",
          url: `/${storeId}/dashboard/${branchId}/report/items-report`,
          roleField: "itemsReport"
        },
        {
          title: "Register Report",
          url: `/${storeId}/dashboard/${branchId}/report/register-report`,
          roleField: "registerReport"
        },
        {
          title: "Expenses Report",
          url: `/${storeId}/dashboard/${branchId}report//expenses-report`,
          roleField: "expensesReport"
        }, {
          title: "Product Sell Report",
          url: `/${storeId}/dashboard/${branchId}/report/product-sell-report`,
          roleField: "productSellReport"
        }, {
          title: "Product Purchase Report",
          url: `/${storeId}/dashboard/${branchId}/report/product-purchase-report`,
          roleField: "productPurchaseReport"
        }, {
          title: "Sell Return Report",
          url: `/${storeId}/dashboard/${branchId}/report/sell-return-report`,
          roleField: "sellReturnReport"
        }, {
          title: "Purchase Return Report",
          url: `/${storeId}/dashboard/${branchId}/report/purchase-return-report`,
          roleField: "purchaseReturnReport"
        }, {
          title: "Trending Product Report",
          url: `/${storeId}/dashboard/${branchId}/report/trending-product-report`,
          roleField: "trendingProductReport"
        }, {
          title: "Purchase & Sale Report",
          url: `/${storeId}/dashboard/${branchId}/report/purchase-sale-report`,
          roleField: "purchaseSaleReport"
        }, {
          title: "Stock Adjustment Report",
          url: `/${storeId}/dashboard/${branchId}/report/stock-adjustment-report`,
          roleField: "stockAdjustmentReport"
        }, {
          title: "Stock Transfer Report",
          url: `/${storeId}/dashboard/${branchId}/report/stock-transfer-report`,
          roleField: "stockTransferReport"
        }, {
          title: "Stock Expiry Report",
          url: `/${storeId}/dashboard/${branchId}/report/stock-expiry-report`,
          roleField: "stockExpiryReport"
        }, {
          title: "Stock Report",
          url: `/${storeId}/dashboard/${branchId}/report/stock-report`,
          roleField: "stockReport"
        }, {
          title: "Customer Group Report",
          url: `/${storeId}/dashboard/${branchId}/report/customer-group-report`,
          roleField: "customerGroupReport"
        }, {
          title: "Customer & Supplier Report",
          url: `/${storeId}/dashboard/${branchId}/report/customer-supplier-report`,
          roleField: "customerSupplierReport"
        }, {
          title: "Tax Report",
          url: `/${storeId}/dashboard/${branchId}/report/tax-report`,
          roleField: "taxReport"
        }, {
          title: "Sale Representative Report",
          url: `/${storeId}/dashboard/${branchId}/report/sale-representative-report`,
          roleField: "saleRepresentativeReport",
        }
      ],
    },
    {
      title: "Contacts",
      url: "#",
      icon: Phone,
      roleField: "contact",
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },

  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {navMain
          .filter(item => !item.roleField || role[item.roleField])
          .map(item => (
            <Collapsible
              key={item.title}
              open={openGroup === item.title}
              onOpenChange={() => setOpenGroup(openGroup === item.title ? null : item.title)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={cn(
                      "transition-colors hover:bg-primary/10 hover:text-primary",
                      isActive(item.url) && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items
                      ?.filter(subItem => !subItem.roleField || role[subItem.roleField])
                      .map(subItem => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className={cn(
                              "transition-colors hover:text-primary",
                              isActive(subItem.url) && "bg-primary/10 text-primary font-medium"
                            )}
                          >
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
