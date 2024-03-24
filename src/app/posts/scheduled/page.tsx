"use client"
import Button from "@/components/button";
import Posts from "@/components/posts";
import getAppwriteClient, { createDocument, getDocuments } from "@/utilities/appwrite";
import { Account, Databases } from "appwrite";
import { League_Spartan, Roboto_Mono } from "next/font/google";
import Link from "next/link";
import React, { FormEvent, useEffect, useRef, useState } from "react";
const leagueSpartan = League_Spartan({ weight: ["400", "700"], subsets: ["latin"] })
const roboto = Roboto_Mono({ weight: ["300", "600"], subsets: ["latin"] })
function page() {

    const [loading, setLoading] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [posts,setPosts] = useState<Array<any>>([]);
    const [username, setUsername] = useState("");
    async function getPosts(userId : string): Promise<void> {
        setLoading(true);
        setPosts(await getDocuments(userId));
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
            getPosts(session.$id);
        } catch (error) {
            // console.log("error getting user")
            setAuthLoading(false);
            window.location.assign("/auth/login")
        }
    }
    useEffect(()=> {
        getCurrentUser();
    },[username])

    if(authLoading) return <>Loading...</>
    return (
        <React.Fragment>
            <p className={`w-full text-center text-3xl ${leagueSpartan.className} mb-10`}>Scheduled Posts</p>
            {
                loading ? <p>Loading posts...</p> : <Posts posts={posts}/>
            }

        </React.Fragment>
    );
}

export default page;