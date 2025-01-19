"use client"

import {useState} from 'react'
import {AuthGuard} from '@/components/AuthGuard'
import Layout from '@/components/templates/Layout'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Label} from "@/components/ui/label"
import {Switch} from "@/components/ui/switch"
import {Button} from "@/components/ui/button"


export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false)

    return (
        <AuthGuard>
            <Layout isLoading={isLoading}>
                <h1 className="text-3xl font-bold mb-8">Settings</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Account Preferences</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="notifications">Email Notifications</Label>
                                <Switch id="notifications"/>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="darkMode">Dark Mode</Label>
                                <Switch id="darkMode"/>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                                <Switch id="twoFactor"/>
                            </div>
                            <Button type="submit">Save Preferences</Button>
                        </form>
                    </CardContent>
                </Card>
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Danger Zone</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button variant="destructive">Delete Account</Button>
                    </CardContent>
                </Card>
            </Layout>
        </AuthGuard>
    )
}