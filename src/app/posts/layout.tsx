
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';


const AuthLayout = ({
    children
}: {
    children: React.ReactNode,
}) => {
    return (
        <main className={`flex h-screen flex-col items-center justify-start relative gap-10`}>
            <nav className={`flex justify-center items-center gap-8 w-full h-7 py-6 border-b-[0.5px] border-b-zinc-800 text-white/90 text-sm backdrop-blur-xl relative z-10`}>
                <Link className={`text-pretty`} href={"/posts/create"}>Create</Link>
                <Link className={`text-pretty`} href={"/posts/scheduled"}>Scheduled</Link>
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