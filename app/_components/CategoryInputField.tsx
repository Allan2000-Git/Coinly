"use client"

import { Transaction } from '@/types/types'
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"  
import { Button } from '@/components/ui/button';
import { Category } from '@prisma/client';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import CreateCategoryDialog from './CreateCategoryDialog';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ICategoryInputFieldProps {
    type: Transaction;
    handleCategoryChange: (category: string) => void;
}

function CategoryInputField({type, handleCategoryChange}:ICategoryInputFieldProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("")

    // Fetch the categories
    const categories = useQuery({
        queryKey: ['categories', type],
        queryFn: async () => {
            const response = await fetch(`/api/get-categories?type=${type}`)
            if (!response.ok) {
                throw new Error('Something went wrong while fetching categories.')
            }
            const data = response.json();
            return data;
        },
    })

    const selectedCategory = categories.data?.find((category : Category) => category.name === value);

    const onCreatedCategory = useCallback((category: Category) => {
            setValue(category.name);
            setOpen(prev => !prev);
    },[setOpen, setValue]);

    useEffect(() => {
        if(!value) return;
        handleCategoryChange(value);
    },[handleCategoryChange, value]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                variant="outline"
                aria-expanded={open}
                role="combobox"
                className="w-[200px] justify-between"
                >
                    {
                        selectedCategory ? (
                            <CategoryItem category={selectedCategory} />
                        ): "Select a category"
                    }
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command
                onSubmit={(e) => e.preventDefault()}
                >
                <CommandInput placeholder="Search category..." />
                <CreateCategoryDialog type={type} onCreatedCategory={onCreatedCategory} />
                <CommandList>
                    <CommandEmpty>No categories found. Please create one.</CommandEmpty>
                    <CommandGroup>
                        {
                            categories.data && categories.data.map((category: Category) => (
                                <CommandItem 
                                key={category.name}
                                onSelect={() => {
                                    setValue(category.name);
                                    setOpen(prev => !prev);
                                }}
                                className="flex items-center justify-between gap-2 cursor-pointer"
                                >
                                    <CategoryItem category={category} />
                                    <CheckIcon 
                                    size={16} 
                                    className={cn(
                                        "opacity-0",
                                        value === category.name && "opacity-100"
                                    )}
                                    />
                                </CommandItem>
                            ))
                        }
                    </CommandGroup>
                </CommandList>
                </Command>
            </PopoverContent>
        </Popover>

    )
}

export default CategoryInputField

function CategoryItem({category}:{category: Category}) {
    return (
        <div className="flex items-center gap-2">
            <span className="w-5 h-5" role="img">{category.icon}</span>
            <span>{category.name}</span>
        </div>
    );
}