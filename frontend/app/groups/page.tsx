"use client"

import { useRouter } from 'next/navigation';
import { useEffect } from 'react'

function GroupsContent() {
     const router = useRouter()
 
     useEffect(() => {
         router.push("/groups/joined");
     }, [router]);
 
     return null
}

export default GroupsContent