import React, { ReactNode } from 'react'
import Topbar from '../_components/Topbar'

function Layout({children}:{children: ReactNode}) {
    return (
        <div
        className="relative h-screen w-full flex flex-col"
        >
            <Topbar />
            <div className="w-full container">
                {children}
            </div>
        </div>
    )
}

export default Layout