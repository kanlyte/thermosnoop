"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function SignOutButton({ children }: { children: React.ReactNode }) {
    return (
        <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => signOut()}
        >
            {children}
        </Button>
    )
}

