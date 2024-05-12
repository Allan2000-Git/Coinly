import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"  
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CurrencyComboBox } from '../_components/CurrencyComboBox';
import Logo from '../_components/Logo';

async function SettingsPage() {
    const user = await currentUser();
    if(!user){
        redirect("/sign-in");
    }

    return (
        <div className="container max-w-xl flex flex-col items-center gap-4 p-4">
            <div className="my-5">
                <Logo />
            </div>
            <h1 className="text-4xl font-bold">Welcome, <span className="text-primary">{user.firstName} {user.lastName}! 👋</span></h1>
            <h2 className="text-gray-400 text-lg">Let&apos;s get started by setting up your currency</h2>
            <div className="w-full mt-7">
                <Card>
                    <CardHeader>
                        <CardTitle>Currency Type</CardTitle>
                        <CardDescription>Set the default currency for your transactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CurrencyComboBox />
                    </CardContent>
                </Card>
                <h3 className="text-sm text-muted-foreground mt-5">You can change these settings anytime</h3>
            </div>
            <Button 
            className="w-full mt-5"
            asChild>
                <Link href="/">Save changes</Link>
            </Button>
        </div>
    )
}

export default SettingsPage