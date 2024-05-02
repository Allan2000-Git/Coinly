import Image from 'next/image'
import React from 'react'

function Logo() {
    return (
        <div className="flex items-center gap-2">
            <Image
            src="/coinly_logo.svg"
            alt='Coinly Logo'
            width={34}
            height={34}
            className='stroke-2 stroke-primary'
            />
            <p className="bg-gradient-to-r from-[#2F80ED] via-[#2D9EE0] to-[#091E3A] text-transparent bg-clip-text text-2xl font-bold">Coinly</p>
        </div>
    )
}

export default Logo