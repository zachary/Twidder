"use client"
import Button from "@/components/button";
import getAppwriteClient from "@/utilities/appwrite";
import  { ID } from "@/utilities/appwrite";
import { Account } from "appwrite";
import { League_Spartan, Monomaniac_One, Roboto_Flex, Roboto_Mono } from "next/font/google";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { FormEvent, FormEventHandler, useRef, useState } from "react";
import { useFormState } from "react-dom";

const leagueSpartan = League_Spartan({ weight: ["400", "700"], subsets: ["latin"] })
const roboto = Roboto_Mono({ weight: ["300", "600"], subsets: ["latin"] })
type passwordViewEnum = "password" | "text";
const page = () => {
    
    const [passwordView, setPasswordView] = useState<passwordViewEnum>("password");
    const [loading, setLoading] = useState(false)
    const formRef = useRef<HTMLFormElement | null>(null);

    const togglePasswordView = () => {
        if (passwordView === "password") setPasswordView("text")
        else setPasswordView("password");
    }

    const handleSignup:FormEventHandler = async (e : FormEvent) => {
        e.preventDefault();
        const formData = new FormData(formRef.current!);
        const email : string = formData.get("email")?.toString() || "";
        const username : string = formData.get("username")?.toString() || "";
        const password : string = formData.get("password")?.toString() || "";
        setLoading(true);

        try {
            const client = getAppwriteClient();
           const account = new Account(client);
           await account.create(ID.unique(), email, password,username);
           // console.log("Account Created!")
           window.location.assign("/auth/login")
        } catch (error) {
            alert(error);
        }
        setLoading(false);
    }



    return (
        <React.Fragment>
            <p className={`w-full text-center text-3xl ${leagueSpartan.className} mb-10`}>Signup</p>
            <form onSubmit={handleSignup} ref={formRef} className={`w-full h-full flex flex-col items-center justify-center gap-5`}>

                <input type="email" name="email" className={`transition-all w-full min-w-[380px] bg-slate-900 focus:bg-slate-800 rounded-sm text-white outline-none border-none px-5 py-3`} placeholder="Enter email" />
                <input type="text" name="username" className={`transition-all w-full min-w-[380px] bg-slate-900 focus:bg-slate-800 rounded-sm text-white outline-none border-none px-5 py-3`} placeholder="Enter Twitter Username" />

                <div className={`group transition-all w-full min-w-[380px] rounded-sm text-white outline-none border-none px-5 py-3 flex justify-center items-center bg-slate-900 focus:bg-slate-800`}>
                    <input type={passwordView} name="password" className={`outline-none border-none bg-slate-900 group-focus:bg-slate-800 flex-1`} placeholder="Enter password" />
                    <div className={``} onClick={togglePasswordView}>
                        {passwordView === "password" ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg> :
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                        }
                    </div>
                </div>
                <Button text="Signup" loading={loading} loadingText="Signing Up..." color="cyan"/>
            </form>
            <p className={`text-white text-sm ${roboto.className} mt-10`}>
                Already registered
                <Link className={" ml-2 text-cyan-500 font-bold"} href="/auth/login">
                    Login
                </Link>
            </p>
        </React.Fragment>
    );
}




export default page;