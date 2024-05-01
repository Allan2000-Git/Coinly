import Image from 'next/image'
import React, { ReactNode } from 'react'

function Layout({children}:{children: ReactNode}) {
    return (
        <div className="h-screen flex items-center justify-center flex-col gap-7">
            <Image 
            src="/coinly-logo.webp"
            alt='Coinly Logo'
            width={100}
            height={100}
            />
            <div>
                {children}
            </div>
        </div>
    )
}

export default Layout