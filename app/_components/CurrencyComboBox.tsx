"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useCallback, useEffect, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { UserSettings } from "@prisma/client"
import { Currency } from "@/types/types"
import { currencies } from "@/lib/constants"
import { toast } from "sonner"
import { updateCurrency } from "@/actions/userSettings"

export function CurrencyComboBox() {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>();

    // Fetch the currency
    const userSettings = useQuery<UserSettings>({
        queryKey: ['userSettings'],
        queryFn: async () => {
            const response = await fetch('/api/user-settings')
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = response.json();
            return data;
        },
    })

    useEffect(() => {
        if(!userSettings) return;
        
        const currentCurrency = currencies.find(currency => currency.value === userSettings.data?.currency);
        if(currentCurrency){
            setSelectedCurrency(currentCurrency);
        }
    }, [userSettings]);

    // Update the selected currency
    const mutation = useMutation({
        mutationFn: updateCurrency,
        onSuccess: (data: UserSettings) => {
            toast.success("Currency updated successfully 🚀", {
                id: "update-currency-type"
            })

            const updatedCurrency = currencies.find(c => c.value === data.currency) || null;
            setSelectedCurrency(updatedCurrency);
        },
        onError: (err: any) => {
            toast.error("Something went wrong while updating your currency", {
                id: "update-currency-type"
            })
        }
    });

    const handleCurrencyChange = useCallback((currency: Currency | null) => {
        if(!currency){
            toast.error("Select a valid currency");
            return;
        }

        toast.loading("Updating your currency type...", {
            id: "update-currency-type"
        });

        mutation.mutate(currency.value);
    }, [mutation]);

    if (isDesktop) {
        return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
                    {selectedCurrency ? <>{selectedCurrency.label}</> : <>Set Currency</>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <CurrencyList setOpen={setOpen} setSelectedCurrency={handleCurrencyChange} />
            </PopoverContent>
        </Popover>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
            <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
            {selectedCurrency ? <>{selectedCurrency.label}</> : <>Set Currency</>}
            </Button>
        </DrawerTrigger>
        <DrawerContent>
            <div className="mt-4 border-t">
            <CurrencyList setOpen={setOpen} setSelectedCurrency={handleCurrencyChange} />
            </div>
        </DrawerContent>
        </Drawer>
    )
}

function CurrencyList({
    setOpen,
    setSelectedCurrency,
}: {
    setOpen: (open: boolean) => void
    setSelectedCurrency: (status: Currency | null) => void
}) {
    return (
        <Command>
        <CommandInput placeholder="Currency type..." />
        <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
            {currencies.map((currency: Currency) => (
                <CommandItem
                key={currency.value}
                value={currency.value}
                disabled={false}
                onSelect={(value: string) => {
                    setSelectedCurrency(currencies.find((priority) => priority.value === value) || null)
                    setOpen(false)
                }}
                >
                {currency.label}
                </CommandItem>
            ))}
            </CommandGroup>
        </CommandList>
        </Command>
    )
}
