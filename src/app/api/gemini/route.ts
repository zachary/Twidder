import { createDocument } from "@/utilities/appwrite";
import {convertToTweet} from "@/utilities/gemini";
import { NextRequest } from "next/server";

export interface GeminiBody {
    linkedinPost : string
}

export async function POST(req : NextRequest) {
    const request = await req.json();
    // console.log(request);
    const {linkedinPost} = request as GeminiBody;
    try {
        if(linkedinPost===null || linkedinPost.length===0) throw new Error("Please Add LinkedIn Post");
        const geminiApiKey = process.env.GEMINI_API_KEY || ""; 
        const tweets : string = await convertToTweet(linkedinPost,geminiApiKey);

        return new Response(`${tweets}`,{
            status : 201,
            statusText : "created"
        })
    } catch (error) {
        // console.log(error);
        return new Response(error as string , {
            status : 500,
            statusText : "Something went wrong"
        })
    }
}