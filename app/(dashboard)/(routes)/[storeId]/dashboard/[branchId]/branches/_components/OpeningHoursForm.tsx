import { useFieldArray, Control } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function OperatingHoursForm({ control }: { control: Control<any> }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "branchSettings.operatingHours",
  })

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col space-y-2 p-4 border rounded-md">
          <FormField
            control={control}
            name={`branchSettings.operatingHours.${index}.day`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Day</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {daysOfWeek.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
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
            name={`branchSettings.operatingHours.${index}.openingTime`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opening Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`branchSettings.operatingHours.${index}.closingTime`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Closing Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="button" variant="destructive" onClick={() => remove(index)}>Remove Operating Hours</Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ day: '', openingTime: '', closingTime: '' })}
      >
        Add Operating Hours
      </Button>
    </div>
  )
}

