"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { MouseEventHandler } from 'react'

interface switchButtonsProps {
    firstButtonLink: string
    secondButtonLink: string
    firstButtonContent: string
    secondButtonContent: string
    handleClick?: MouseEventHandler<HTMLAnchorElement>
}

function SwitchButtons({ firstButtonLink, secondButtonLink, firstButtonContent, secondButtonContent, handleClick }: switchButtonsProps) {
    const pathname = usePathname()

    return (
        <div className="switch-buttons">
            <Link
                href={firstButtonLink || ""}
                className={pathname.startsWith(firstButtonLink || "") ? "active" : ""}
                onClick={handleClick}
            >
                {firstButtonContent}
            </Link>
            <Link
                href={secondButtonLink || ""}
                className={pathname.startsWith(secondButtonLink || "") ? "active" : ""}
                onClick={handleClick}
            >
                {secondButtonContent}
            </Link>
        </div>
    )
}

export default SwitchButtons