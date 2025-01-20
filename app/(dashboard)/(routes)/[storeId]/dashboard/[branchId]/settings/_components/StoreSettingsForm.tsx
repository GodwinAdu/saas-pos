'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import BasicInfoForm from './BasicForm'
import ConfigurationForm from './ConfiguratonForm'
import NotificationsForm from './NotificationForm'
import SubscriptionForm from './SubscriptonForm'
import AiIntegrationForm from './ai-integration'
import { IStore } from '@/lib/types'
import DangerZone from './DangerZone'




export default function StoreSettingsForm({ store }: { store: IStore }) {

    return (

        <Tabs defaultValue="basic-info" className="w-full">
            <TabsList className="">
                <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                <TabsTrigger value="configuration-settings">Configuration</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="subscription">Subscription</TabsTrigger>
                <TabsTrigger value="ai-integration">AI Integration</TabsTrigger>
                <TabsTrigger className='bg-red-500 text-white' value="danger">Danger Zone</TabsTrigger>
            </TabsList>
            <TabsContent value="basic-info">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>Manage your store&apos;s basic information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BasicInfoForm store={store} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="configuration-settings">
                <Card>
                    <CardHeader>
                        <CardTitle>Configuration Settings</CardTitle>
                        <CardDescription>Configure your payment and email settings.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ConfigurationForm store={store} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="notifications">
                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Configure your notification preferences.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <NotificationsForm store={store} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="subscription">
                <Card>
                    <CardHeader>
                        <CardTitle>Subscription</CardTitle>
                        <CardDescription>Manage your subscription plan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SubscriptionForm store={store} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="ai-integration">
                <Card>
                    <CardHeader>
                        <CardTitle>AI Integration</CardTitle>
                        <CardDescription>Manage your AI Settings.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AiIntegrationForm store={store} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="danger">
                <DangerZone store={store} />
            </TabsContent>
        </Tabs>
    )
}

