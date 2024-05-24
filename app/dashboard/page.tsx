import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation';
import React from 'react'
import prisma from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import CreateTransaction from '@/app/_components/CreateTransaction';

async function Dashboard() {
    const user = await currentUser();
    if(!user){
        redirect("/sign-in");
    }

    const userSettings = await prisma.userSettings.findUnique({
        where: {
            userId: user.id
        }
    });
    if(!userSettings){
        redirect("/settings");
    }

    return (
        <div className="h-full bg-background">
            <div className="border-b bg-card">
                <div className="container flex flex-wrap items-center justify-between py-4">
                    <p className="text-lg font-semibold">Hey, {user.firstName}! 👋</p>
                    <div className="flex items-center gap-4">
                        <CreateTransaction 
                        trigger={
                            <Button variant="outline" className="bg-green-500 border-green-900 hover:bg-green-700 text-white hover:text-white">
                                New Income
                            </Button>
                        }
                        type="income"
                        />
                        <CreateTransaction 
                        trigger={
                            <Button variant="outline" className="bg-red-500 border-red-900 hover:bg-red-700 text-white hover:text-white">
                                New Expense
                            </Button>
                        }
                        type="expense"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard