'use client'

import React, { ReactNode } from 'react'
import { ThemeProvider } from './ThemeProvider'
import NextTopLoader from 'nextjs-toploader'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

function RootProviders({children}:{children: ReactNode}) {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
            >
                <NextTopLoader 
                    color="#2563eb"
                    height={3}
                    speed={100}
                />
                {children}
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default RootProviders