import { auth } from '@/auth';
import ToolsPage from '@/components/dashboard/ToolsPage'
import React from 'react'

const page = async () => {
    const session = await auth();
  return (
    <div>
        {session ? (
            <ToolsPage session={session} />
        ) : (
            <div>No session found.</div>
        )}
    </div>
  )
}

export default page