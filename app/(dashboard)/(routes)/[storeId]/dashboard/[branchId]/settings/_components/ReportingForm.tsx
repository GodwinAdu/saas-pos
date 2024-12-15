import { Control, useFieldArray } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DraftingCompass } from 'lucide-react'



const reportTypes = ['Sales', 'Inventory', 'Customer Activity']
const frequencies = ['Daily', 'Weekly', 'Monthly']

export default function ReportingForm({ control }: { control: Control<any> }) {
  const { fields: scheduleFields, append: appendSchedule, remove: removeSchedule, move: moveSchedule } = useFieldArray({
    control,
    name: "reporting.schedule",
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enabled Reports</CardTitle>
          <CardDescription>Select which reports you want to enable for your store.</CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="reporting.enabledReports"
            render={() => (
              <FormItem>
                {reportTypes.map((type) => (
                  <FormField
                    key={type}
                    control={control}
                    name="reporting.enabledReports"
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
                                return checked
                                  ? field.onChange([...field.value, type])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value: string) => value !== type
                                      )
                                    )
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
          <CardTitle>Report Schedule</CardTitle>
          <CardDescription>Configure the schedule for your enabled reports.</CardDescription>
        </CardHeader>
        <CardContent>
          {scheduleFields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-4 mb-4">
              <DraftingCompass className="cursor-move" />
              <FormField
                control={control}
                name={`reporting.schedule.${index}.reportType`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a report type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {reportTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`reporting.schedule.${index}.frequency`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {frequencies.map((freq) => (
                          <SelectItem key={freq} value={freq}>
                            {freq}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeSchedule(index)}>
                ✕
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendSchedule({ reportType: '', frequency: '', lastGenerated: null })}
          >
            Add Schedule
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

