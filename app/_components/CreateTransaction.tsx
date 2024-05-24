"use client"

import { ReactNode, useCallback, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Transaction } from '@/types/types';
import { cn } from '@/lib/utils';
import { createTransactionSchema, createTransactionSchemaType } from '@/schema/transaction';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CategoryInputField from './CategoryInputField';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { CalendarIcon, Loader2Icon } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DialogClose } from '@radix-ui/react-dialog';
import { createTransaction } from '@/actions/transactions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { convertToUTCDate } from '@/lib/helpers';

interface ITransactionProps {
    trigger: ReactNode;
    type: Transaction;
}

function CreateTransaction({trigger, type}:ITransactionProps) {
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof createTransactionSchema>>({
        resolver: zodResolver(createTransactionSchema),
        defaultValues: {
            amount: 0,
            description: "",
            category: "",
            type,
            date: new Date()
        },
    });

    const handleCategoryChange = useCallback((category: string) => {
        form.setValue("category", category);
    },[form]);

    // Creating transaction
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createTransaction,
        onSuccess: async (data: Transaction) => {
            form.reset();

            toast.success("Transaction created successfully 🚀", {
                id: "create-transaction"
            });

            setOpen(prev => !prev);

            await queryClient.invalidateQueries({
                queryKey: ["overview"]
            });
        },
        onError: (err: any) => {
            toast.error("Something went wrong while creating your transaction", {
                id: "create-transaction"
            })
        }
    });

    const onSubmit = useCallback((values: createTransactionSchemaType) => {       
        toast.loading("Creating transaction...", {
            id: "create-transaction"
        });

        mutation.mutate({
            ...values,
            date: convertToUTCDate(values.date)
        });
    },[mutation]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create a new transaction of 
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
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>This is an optional field.</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className="flex items-center justify-between gap-2">
                            <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <CategoryInputField type={type} handleCategoryChange={handleCategoryChange} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col justify-between gap-2">
                                    <FormLabel>Transaction date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[200px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {
                                                    field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                    <span>Pick a date</span>
                                                    )
                                                }
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={(value) => {
                                                if (!value) return;
                                                field.onChange(value);
                                            }}
                                            initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
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

export default CreateTransaction