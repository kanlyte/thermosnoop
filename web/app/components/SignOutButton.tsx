"use client"

import { signOut } from "next-auth/react"
import { Button, ButtonProps } from "@/components/ui/button"

interface SignOutButtonProps extends ButtonProps {
    children: React.ReactNode;
}

export function SignOutButton({ children, ...props }: SignOutButtonProps) {
    return (
        <Button
            {...props}
            onClick={() => signOut()}
        >
            {children}
        </Button>
    )
}