"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

interface switchButtonsProps {
    firstButtonLink?: string
    secondButtonLink?: string
    firstButtonContent: string
    secondButtonContent: string
}

function SwitchButtons({ firstButtonLink, secondButtonLink, firstButtonContent, secondButtonContent }: switchButtonsProps) {
    const pathname = usePathname()

    return (
        <div className="switch-buttons">
            <Link
                href={firstButtonLink || ""}
                className={pathname.startsWith(firstButtonLink || "") ? "active" : ""}
            >
                {firstButtonContent}
            </Link>
            <Link
                href={secondButtonLink || ""}
                className={pathname.startsWith(secondButtonLink || "") ? "active" : ""}
            >
                {secondButtonContent}
            </Link>
        </div>
    )
}

export default SwitchButtons