
import { Label } from "recharts"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Switch } from "../ui/switch"
import { ModeToggle } from "../commons/theme/ModeToggle"
import { useSoundStore } from "@/hooks/use-sound-store"
import { Settings } from "lucide-react"
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const SettingComponent = () => {
    const { soundEnabled, setSoundEnabled } = useSoundStore()


    const handleAudioToggle = (checked: boolean) => {
        setSoundEnabled(checked)
        console.log('Audio enabled:', checked)
        // Here you would typically save this setting to your backend or local storage
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[96%] max-w-2xl ">
                <VisuallyHidden>
                    <DialogTitle>Settings</DialogTitle>
                </VisuallyHidden>
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">Settings</h1>
                    <Card>
                        <CardHeader>
                            <CardTitle>Audio Settings</CardTitle>
                            <CardDescription>Manage your audio preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="flex flex-col space-y-1">
                                    <span>Enable Audio</span>
                                    <span className="font-normal text-sm text-muted-foreground">
                                        Turn on/off all sound effects
                                    </span>
                                </Label>
                                <Switch
                                    id="audio-toggle"
                                    checked={soundEnabled}
                                    onCheckedChange={handleAudioToggle}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Theme Settings</CardTitle>
                            <CardDescription>Customize your visual experience</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-4">
                                <Label >Select Theme</Label>
                                <ModeToggle />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SettingComponent