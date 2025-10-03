"use client"

import { signOut } from "next-auth/react"

export default function LogOut(){
    return <span className="cursor-pointer bg-[#b23b3b] hover:opacity-80 text-white  shadow-lg rounded-lg mx-auto w-32 h-10 font-bold uppercase flex justify-center items-center" onClick={() => {
        signOut()
    }}>Logout</span>
}