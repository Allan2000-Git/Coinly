import Image from 'next/image'
import React, { ReactNode } from 'react'
import Logo from '../_components/Logo'
import Link from 'next/link'

function Layout({children}:{children: ReactNode}) {
    return (
        <div className="h-screen flex items-center justify-center flex-col gap-7">
            <Link href="/"><Logo /></Link>
            <div>
                {children}
            </div>
        </div>
    )
}

export default Layout