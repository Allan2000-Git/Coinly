"use client"

import React, { useState } from 'react'
import Logo from './Logo'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { ThemeSwitchButton } from './ThemeSwitchButton'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"  
import { Menu } from 'lucide-react'

const links = [
    {
        label: "Dashboard",
        link: "/dashboard"
    },
    {
        label: "Transactions",
        link: "/transactions"
    },
    {
        label: "Track Events",
        link: "/track-events"
    }
]

function MobileTopbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="block md:hidden bg-background border-separate">
            <nav className="container flex items-center justify-between px-8 py-3">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu size={22} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <Logo />
                        <div className="flex flex-col gap-4 mt-10">
                        {
                            links.map((link, index) => (
                                <TopbarItem 
                                key={index}
                                handleCloseSheet={() => setIsOpen(prev => !prev)} 
                                {...link} 
                                />
                            ))
                        }
                    </div>
                    </SheetContent>
                </Sheet>
                <div className="flex items-center gap-4">
                    <ThemeSwitchButton />
                    <UserButton afterSignOutUrl="/sign-in" />
                </div>
            </nav>
        </div>
    )
}

function Topbar() {
    return (
        <>
            <DesktopTopbar />
            <MobileTopbar />
        </>
    )
}

function DesktopTopbar() {
    return (
        <div className="hidden md:block bg-background border-b border-separate">
            <nav className="container flex items-center justify-between px-8">
                <div className="flex h-[80px] min-h-[60px] items-center gap-4">
                    <Logo />
                    <div className="h-full flex">
                        {
                            links.map((link, index) => (
                                <TopbarItem key={index} {...link} />
                            ))
                        }
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeSwitchButton />
                    <UserButton afterSignOutUrl="/sign-in" />
                </div>
            </nav>
        </div>
    )
}

function TopbarItem({label, link, handleCloseSheet}:{
    label: string,
    link: string,
    handleCloseSheet?: () => void;
}) {
    const pathName = usePathname();
    const isActive = pathName === link;

    return (
        <div 
        className="relative flex items-center"
        onClick={handleCloseSheet}
        >
            <Link 
            href={link}
            className={cn(
                buttonVariants({variant: "ghost"}),
                "w-full text-md text-muted-foreground hover:text-foreground justify-start",
                isActive && "text-foreground"
            )}
            >
                {label}
            </Link>
            {
                isActive &&
                <div 
                className="hidden md:block absolute -bottom-[2px] bg-foreground left-1/2 h-[2px] w-[80%] -translate-x-1/2 rounded-xl"
                >
                </div>
            }
        </div>
    )
}

export default Topbar