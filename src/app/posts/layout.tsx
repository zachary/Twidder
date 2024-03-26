"use client"
import getAppwriteClient from '@/utilities/appwrite';
import { Account } from 'appwrite';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';


const AuthLayout = ({
    children
}: {
    children: React.ReactNode,
}) => {
    const [loggingOut, setLoggingOut] = useState<boolean>(false);
    const handleLogout = async () => {
        try {
            setLoggingOut(true);
            const appwriteClient = await getAppwriteClient();
            const account = new Account(appwriteClient);
            const session = await account.getSession('current');
            await account.deleteSession(session.$id);
            window.location.assign("/auth/login");
        } catch (error) {
            alert("Error Signing Out!");
            setLoggingOut(false);
        }
    }
    return (
        <main className={`flex h-screen flex-col items-center justify-start relative gap-10`}>
            <nav className={`flex justify-center items-center gap-8 w-full h-7 py-6 border-b-[0.5px] border-b-zinc-800 text-white/90 text-sm backdrop-blur-xl relative z-10`}>
                <Link className={`text-pretty`} href={"/posts/create"}>Create</Link>
                <Link className={`text-pretty`} href={"/posts/scheduled"}>Scheduled</Link>
                <span onClick={handleLogout} className={`text-pretty bg-none text-cyan-500 px-4 py-2 text-md cursor-pointer`}>{
                loggingOut ? 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-500/70 animate-spin">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
                : `Logout`
                }</span>
            </nav>
            <div className={`w-full h-full absolute z-0`}>
            <Image src={"/sky.png"} alt='starry sky' layout='fill' objectFit='cover'/>
            </div>
            <div className={`w-full h-full absolute z-2 bg-gradient-to-t from-transparent to-black/15`}>
            
            </div>
            <section className={`h-[70vh] w-2/5 min-w-[480px] grid place-items-center place-content-center border rounded-lg border-zinc-500 relative bg-transparent backdrop-blur z-4 overflow-y-scroll`}>
                {children}
            </section>
        </main>
    );
}

export default AuthLayout;