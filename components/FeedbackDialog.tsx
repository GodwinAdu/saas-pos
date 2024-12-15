import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SendHorizonal } from "lucide-react"
import { useId } from "react"

export function FeedbackDialog() {
    const id = useId()
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full"  size="sm"><SendHorizonal />
                    Feedback</Button>
            </DialogTrigger>
            <DialogContent className="w-[96%] max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Report an issue</CardTitle>
                        <CardDescription>
                            What area are you having problems with?
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor={`area-${id}`}>Area</Label>
                                <Select defaultValue="billing">
                                    <SelectTrigger id={`area-${id}`} aria-label="Area">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="team">Team</SelectItem>
                                        <SelectItem value="billing">Billing</SelectItem>
                                        <SelectItem value="account">Account</SelectItem>
                                        <SelectItem value="deployments">Deployments</SelectItem>
                                        <SelectItem value="support">Support</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor={`security-level-${id}`}>Security Level</Label>
                                <Select defaultValue="2">
                                    <SelectTrigger
                                        id={`security-level-${id}`}
                                        className=" w-full truncate"
                                        aria-label="Security Level"
                                    >
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Severity 1 (Highest)</SelectItem>
                                        <SelectItem value="2">Severity 2</SelectItem>
                                        <SelectItem value="3">Severity 3</SelectItem>
                                        <SelectItem value="4">Severity 4 (Lowest)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor={`subject-${id}`}>Subject</Label>
                            <Input id={`subject-${id}`} placeholder="I need help with..." />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor={`description-${id}`}>Description</Label>
                            <Textarea
                                id={`description-${id}`}
                                placeholder="Please include all information relevant to your issue."
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="justify-between space-x-2">
                        <Button variant="ghost" size="sm">
                            Cancel
                        </Button>
                        <Button size="sm">Submit</Button>
                    </CardFooter>
                </Card>
            </DialogContent>
        </Dialog>
    )
}
