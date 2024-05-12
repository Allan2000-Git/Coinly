import React, { ReactNode } from 'react'

function Layout({children}:{children: ReactNode}) {
    return (
        <div className="relative h-screen w-full flex items-center justify-center">
            {children}
        </div>
    )
}

export default Layout