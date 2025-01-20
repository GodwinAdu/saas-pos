"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { BarChart, PieChart, LineChart, ScatterChart, Loader2, } from 'lucide-react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"
import MultiText from "../commons/MultiText"
import { useRouter } from "next/navigation"
import { playErrorSound, playSuccessSound } from "@/lib/audio"
import { updateBranch } from "@/lib/actions/branch.actions"

const reportTypes = ['Sales', 'Inventory', 'Customer Activity']

const reportTypeSchema = z.object({
  name: z.string().optional(),
  frequency: z.enum(["daily", "weekly", "monthly", "quarterly", "annually"]).optional(),
  recipients: z.array(z.string().email("Invalid email address")).optional(),
})

const reportingSettingsSchema = z.object({
  reportSettings: z.object({
    enabledReports: z.array(z.string()).optional(),
    reportTypes: z.array(reportTypeSchema).optional(),
    dataRetentionPeriod: z.coerce.number().min(1).max(84),
    enableDataVisualization: z.boolean().optional(),
    preferredChartTypes: z.array(z.string()).optional(),
    enableAlerts: z.boolean().optional(),
    alertThresholds: z.array(z.object({
      metric: z.string().optional(),
      condition: z.enum(["greater_than", "less_than", "equal_to"]).optional(),
      value: z.coerce.number().optional(),
    })).optional(),
    exportFormats: z.array(z.string()).optional(),
    enableScheduling: z.boolean().optional(),
    scheduledReportTime: z.string().optional(),
  }).optional()
})

type ReportingSettingsValues = z.infer<typeof reportingSettingsSchema>



interface Branch {
  _id: string;
  reportSettings?: Partial<ReportingSettingsValues>;
}

export default function ReportingSettings({ branch }: { branch: Branch }) {
  const router = useRouter();
  const branchId = branch._id;

  const defaultValues: Partial<ReportingSettingsValues> = branch.reportSettings ? { reportSettings: { ...branch.reportSettings, dataRetentionPeriod: branch.reportSettings.reportSettings?.dataRetentionPeriod ?? 1 } } : {
    reportSettings: {
      enabledReports: [],
      reportTypes: [],
      dataRetentionPeriod: 1,
      enableDataVisualization: true,
      preferredChartTypes: ["bar"],
      enableAlerts: false,
      alertThresholds: [],
      exportFormats: ["pdf", "csv", "xlsx"],
      enableScheduling: true,
      scheduledReportTime: "00:00",
    }
  }
  const form = useForm<ReportingSettingsValues>({
    resolver: zodResolver(reportingSettingsSchema),
    defaultValues,
  });

  const { isSubmitting } = form.formState;

  const selectedReports = form.watch('reportSettings.enabledReports')


  async function onSubmit(data: ReportingSettingsValues) {
    try {
      await updateBranch(branchId, data);
      playSuccessSound();
      router.refresh();
      toast({
        title: "Reporting settings updated successfully",
        description: "Your reporting settings have been saved.",
        variant: "success",
      })

    } catch {
      playErrorSound();
      toast({
        title: "Error updating reporting settings",
        description: "An error occurred while updating your reporting settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="reports" className="w-full">
          <TabsList>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Enabled Reports</CardTitle>
                <CardDescription>Select which reports you want to enable for your store.</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="reportSettings.enabledReports"
                  render={() => (
                    <FormItem>
                      {reportTypes?.map((type) => (
                        <FormField
                          key={type}
                          control={form.control}
                          name="reportSettings.enabledReports"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={type}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(type)}
                                    onCheckedChange={(checked) => {
                                      const enabledReports = checked
                                        ? [...(field.value || []), type]
                                        : field.value?.filter((value: string) => value !== type);

                                      // Update `enabledReports`
                                      field.onChange(enabledReports);

                                      // Synchronize `reportTypes`
                                      const currentReportTypes = form.getValues('reportSettings.reportTypes') || [];
                                      const updatedReportTypes = checked
                                        ? [...currentReportTypes, { name: type, frequency: undefined, recipients: [] }]
                                        : currentReportTypes.filter((report) => report.name !== type);

                                      form.setValue('reportSettings.reportTypes', updatedReportTypes);
                                    }}
                                  />

                                </FormControl>
                                <FormLabel className="font-normal">
                                  {type}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Report Types</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Configure different types of reports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedReports?.map((reportType, index) => (
                  <div
                    key={reportType}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg shadow-sm"
                  >
                    {/* Report Name */}
                    <FormField
                      control={form.control}
                      name={`reportSettings.reportTypes.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Report Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter report name"
                              className="focus:ring focus:ring-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Frequency */}
                    <FormField
                      control={form.control}
                      name={`reportSettings.reportTypes.${index}.frequency`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Frequency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="focus:ring focus:ring-blue-500">
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                              <SelectItem value="annually">Annually</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Recipients */}
                    <div className="flex items-center gap-4">
                      <FormField
                        control={form.control}
                        name={`reportSettings.reportTypes.${index}.recipients`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-sm font-medium">Recipients</FormLabel>
                            <FormControl>
                              <MultiText
                                placeholder="Add some tags (Optional)"
                                value={field.value ?? []}
                                onChange={(tag) =>
                                  field.onChange([...field.value ?? [], tag])
                                }
                                onRemove={(tagToRemove) =>
                                  field.onChange([
                                    ...(field.value ?? []).filter(
                                      (tag) => tag !== tagToRemove
                                    ),
                                  ])
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

          </TabsContent>
          <TabsContent value="visualization">
            <Card>
              <CardHeader>
                <CardTitle>Data Visualization</CardTitle>
                <CardDescription>Configure data visualization settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="reportSettings.enableDataVisualization"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Data Visualization</FormLabel>
                        <FormDescription>
                          Turn on advanced data visualization features for reports.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {form.watch("reportSettings.enableDataVisualization") && (
                  <FormField
                    control={form.control}
                    name="reportSettings.preferredChartTypes"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Preferred Chart Types</FormLabel>
                          <FormDescription>
                            Select the chart types you prefer for data visualization.
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { value: "bar", label: "Bar Chart", icon: BarChart },
                            { value: "line", label: "Line Chart", icon: LineChart },
                            { value: "pie", label: "Pie Chart", icon: PieChart },
                            { value: "scatter", label: "Scatter Plot", icon: ScatterChart },
                          ].map((chartType) => (
                            <FormField
                              key={chartType.value}
                              control={form.control}
                              name="reportSettings.preferredChartTypes"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={chartType.value}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(chartType.value)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, chartType.value])
                                            : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== chartType.value
                                              )
                                            )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal flex items-center">
                                      <chartType.icon className="w-4 h-4 mr-2" />
                                      {chartType.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Reporting Alerts</CardTitle>
                <CardDescription>Configure alert settings for your reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="reportSettings.enableAlerts"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Alerts</FormLabel>
                        <FormDescription>
                          Turn on alerts for important changes in your metrics.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {form.watch("reportSettings.enableAlerts") && (
                  <div>
                    <FormLabel>Alert Thresholds</FormLabel>
                    {['Product Expiry'].map((reportType, index) => (
                      <div key={reportType} className="flex items-center space-x-2 mb-4">
                        <FormField
                          control={form.control}
                          name={`reportSettings.alertThresholds.${index}.metric`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input {...field} defaultValue={reportType} placeholder="Metric name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`reportSettings.alertThresholds.${index}.condition`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Condition" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="greater_than">Greater than</SelectItem>
                                  <SelectItem value="less_than">Less than</SelectItem>
                                  <SelectItem value="equal_to">Equal to</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`reportSettings.alertThresholds.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input {...field} type="number" placeholder="Threshold value" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                      </div>
                    ))}

                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Configure advanced reporting options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="reportSettings.dataRetentionPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Retention Period (months)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="1" max="84" />
                      </FormControl>
                      <FormDescription>
                        Set how long to retain reporting data (1-84 months).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reportSettings.exportFormats"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Export Formats</FormLabel>
                        <FormDescription>                          Select the file formats for exporting reports.
                        </FormDescription>
                      </div>
                      {["pdf", "csv", "xlsx", "json"].map((format) => (
                        <FormField
                          key={format}
                          control={form.control}
                          name="reportSettings.exportFormats"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={format}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(format)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, format])
                                        : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== format
                                          )
                                        )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {format.toUpperCase()}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reportSettings.enableScheduling"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Scheduling</FormLabel>
                        <FormDescription>
                          Allow scheduling of report generation and distribution.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {form.watch("reportSettings.enableScheduling") && (
                  <FormField
                    control={form.control}
                    name="reportSettings.scheduledReportTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scheduled Report Time</FormLabel>
                        <FormControl>
                          <Input {...field} type="time" />
                        </FormControl>
                        <FormDescription>
                          Set the time for scheduled reports to be generated and sent.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Button disabled={isSubmitting} type="submit">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? 'Updating ...' : "Save Report Settings"}
        </Button>
      </form>
    </Form>
  )
}

