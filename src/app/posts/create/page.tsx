"use client"
import Button from "@/components/button";
import getAppwriteClient, { createDocument } from "@/utilities/appwrite";
import { Account, Databases } from "appwrite";
import axios from "axios";
import { League_Spartan, Roboto_Mono } from "next/font/google";
import Link from "next/link";
import React, { FormEvent, useEffect, useRef, useState } from "react";

const leagueSpartan = League_Spartan({ weight: ["400", "700"], subsets: ["latin"] })
const roboto = Roboto_Mono({ weight: ["300", "600"], subsets: ["latin"] })
function page() {

    const [loading, setLoading] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const formRef = useRef<HTMLFormElement | null>(null);
    const [username, setUsername] = useState("");
    async function handlePost(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        const formData = new FormData(formRef.current!);
        const post: string = formData.get("post")?.toString() || "";
        if (post.length === 0) {
            alert("Cannot Add Empty!");
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post("/api/gemini", {
                linkedinPost: post
            });
            const posts : Array<string> = data.split("|");
            console.log(posts, typeof posts);
            let docIds : Array<string> = [];
            posts.forEach(async (tweet) => {
                const docId = await createDocument(tweet);
                if (docId === "failed") {
                    throw new Error("Not Created!")
                }
                docIds.push(docId);
            });

            alert("Posts create : "+docIds.length)
        } catch (error) {
            console.log(error)
        }

        setLoading(false)
    }

    const getCurrentUser = async () => {
        setAuthLoading(true);
        try {
            const client = getAppwriteClient();
            const account = new Account(client);
            const session = await account.get();
            setUsername(session.name);
            setAuthLoading(false);
        } catch (error) {
            console.log("error getting user")
            setAuthLoading(false);
            window.location.assign("/auth/login")
        }
    }
    useEffect(() => {
        getCurrentUser();
    }, [username])

    if (authLoading) return <>Loading...</>
    return (
        <React.Fragment>
            <p className={`w-full text-center text-3xl ${leagueSpartan.className} mb-10`}>Create Post</p>
            <form onSubmit={handlePost} ref={formRef} className={`w-full h-full flex flex-col items-center justify-center gap-5`}>

                <input disabled type="text" name="username" className={`transition-all w-full min-w-[380px] bg-slate-900 focus:bg-slate-800 rounded-sm text-white outline-none border-none px-5 py-3`} placeholder={username} />
                <textarea name="post" className={`transition-all w-full min-w-[380px] bg-slate-900 focus:bg-slate-800 rounded-sm text-white outline-none border-none px-5 py-3`} placeholder="Enter Post" maxLength={3000} />

                <Button text="Add Post" loading={loading} loadingText="Scheduling..." color="cyan" />
            </form>

        </React.Fragment>
    );
}

export default page;