import { Control } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SoundSettingForm({ control }: { control: Control<any> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sound Settings</CardTitle>
        <CardDescription>Manage your sound alert settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="sound"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Sound Effects
                </FormLabel>
                <FormDescription>
                  Enable sound effects for notifications.
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
       
      </CardContent>
    </Card>
  )
}

