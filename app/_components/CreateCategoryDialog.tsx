"use client";

import { createCategorySchema, createCategorySchemaType } from '@/schema/category';
import { Transaction } from '@/types/types'
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from '@/lib/utils';
import { Loader2Icon, SquarePlus } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { DialogClose } from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCategory } from '@/actions/categories';
import { toast } from 'sonner';
import { Category } from '@prisma/client';
import { useTheme } from 'next-themes';

interface ICreateCategoryDialogProps {
    type: Transaction;
    onCreatedCategory: (category: Category) => void;
}

function CreateCategoryDialog({type, onCreatedCategory}:ICreateCategoryDialogProps) {
    const [open, setOpen] = useState(false);
    const theme = useTheme();

    const form = useForm<z.infer<typeof createCategorySchema>>({
        resolver: zodResolver(createCategorySchema),
        defaultValues: {
            name: "",
            icon: "",
            type
        },
    });

    // Creating category
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createCategory,
        onSuccess: async (data: Category) => {
            form.reset();

            toast.success("Category created successfully 🚀", {
                id: "create-category"
            });

            onCreatedCategory(data);

            await queryClient.invalidateQueries({
                queryKey: ["categories"]
            });
        },
        onError: (err: any) => {
            toast.error("Something went wrong while creating your category", {
                id: "create-category"
            })
        }
    });

    const onSubmit = useCallback((values: createCategorySchemaType) => {       
        toast.loading("Creating category...", {
            id: "create-category"
        });

        mutation.mutate(values);
        console.log(values)
    },[mutation]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                variant="ghost"
                className="flex items-center gap-2 m-1 mb-0"
                >
                Create new
                <SquarePlus size={14} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create a new category for 
                        <span 
                        className={cn("ml-1", type === "income" ? "text-green-500" : "text-red-500")}
                        >
                            {type}
                        </span>
                    </DialogTitle>  
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="icon"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Icon</FormLabel>
                            <FormControl>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full h-[100px] flex items-center justify-center">
                                            {
                                                form.watch("icon") ? (
                                                    <div className="flex flex-col items-center justify-center gap-2">
                                                        <span className="text-3xl" role="img">{field.value}</span>
                                                        Click here to change
                                                    </div>
                                                ):(
                                                    <div>Click here to select</div>
                                                )
                                            }
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full flex items-center justify-center" align="start">
                                        <Picker 
                                        theme={theme.resolvedTheme} 
                                        data={data} 
                                        onEmojiSelect={(emoji: {native: string}) => field.onChange(emoji.native)} 
                                        />
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </form>
                </Form>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button 
                        onClick={() => form.reset()}
                        type="button" 
                        variant="secondary"
                        >
                            Close
                        </Button>
                    </DialogClose>
                    <Button 
                    onClick={form.handleSubmit(onSubmit)} 
                    disabled={mutation.isPending} 
                    type="submit"
                    >
                        {
                            mutation.isPending ? `Creating new ${type}` : `Create new ${type}`
                        }
                        {
                            mutation.isPending && <Loader2Icon className="animate-spin ml-2" size={18} />
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateCategoryDialog