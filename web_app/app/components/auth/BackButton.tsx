"use client";
//imports
import { Button } from "@/components/ui/button";
import Link from "next/link";
//interface
interface BackButtonProps {
    label: string;
    href: string;
}

export const BackButton = ({
    label,
    href
}: BackButtonProps) => {
    return (
        <Button 
            variant="link"
            className="w-full"
            size="lg"
            asChild
        >
            <Link href={href}>
                {label}
            </Link>
        </Button>
    )
}