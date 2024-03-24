import getAppwriteClient, { getDocuments } from "@/utilities/appwrite";
import decryptData from "@/utilities/encryption/decrypt";
import getTwitterClient, { postTweet } from "@/utilities/twitter";
import AppwriteSDK from "node-appwrite"
import { NextRequest } from "next/server";
import { getTechJoke, getTechNews } from "@/utilities/gemini";

const dummyPostTweet = ({post} : {post : string}) => {
    return {
        status : 200,
        message : "Done",
        tweet : post
    }
}
interface TweetBody {
    encryptedData? : string
}

const getAppwriteSDK = () => {
    const client = new AppwriteSDK.Client();
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const apiKey = process.env.APPWRITE_API_KEY;

    if(!endpoint || !projectId || !apiKey) return null;

    client
        .setEndpoint(endpoint) // Your API Endpoint
        .setProject(projectId) // Your project ID
        .setKey(apiKey) // Your secret API key
    ;
    return client;
}

const createFromUserPosts = async (userId : string) => {
    
        const userDocuments = await getDocuments(userId);
        if(userDocuments.length===0) throw new Error("No Posts Scheduled!");
        const postToTweet = userDocuments[0];
        const response = await dummyPostTweet({post : postToTweet["post"]});
        console.log(response);
        const appwriteApiKey = process.env.APPWRITE_API_KEY;

        if(!appwriteApiKey) throw new Error("Missing Admin Permissions");
        console.log(appwriteApiKey);
        const appwriteClient = await getAppwriteSDK();
        if(!appwriteClient) throw new Error("Appwrite Client Error!")
        const dbId : string = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
        const collectionId : string = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION!;
        const databases = new AppwriteSDK.Databases(appwriteClient);
        await databases.deleteDocument(dbId,collectionId,postToTweet.$id);
        
}


const createFromTechJoke =async () => {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if(!geminiApiKey) throw new Error("Missing Gemini Permission");
    const joke = await getTechJoke(geminiApiKey);
    const response = await dummyPostTweet({post : joke});
    console.log(response);
}

const createFromTechNews =async () => {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if(!geminiApiKey) throw new Error("Missing Gemini Permission");
    const joke = await getTechNews(geminiApiKey);
    const response = await dummyPostTweet({post : joke});
    console.log(response);
}


export async function POST(req : NextRequest){
    const request = await req.json();
    console.log(request);
    const {encryptedData} = request as TweetBody;
    if(!encryptedData) {
        return new Response("Invalid Request", {
            status : 403,
            headers : {
                
            }
        });
    }
    const {userId} = decryptData(encryptedData);
    const currentHour: number = new Date().getHours();
    // console.log(body.userId);
    try {
        // Switch based on time 
        if((currentHour===10 && currentHour<11)|| (currentHour===17 && currentHour<18) || (currentHour===22 && currentHour<23)) {
            await createFromUserPosts(userId);
        }

        else if(currentHour===14 && currentHour<15) {
            await createFromTechJoke()
        }

        else if(currentHour===20 && currentHour<21){
           await createFromTechNews();
        }

        else {
            await createFromTechNews();
        }
        
        return new Response("Done!!", {
            status : 200,
            headers : {

            }
        });
      } catch (error) {
        // Handle errors
        console.log('Error sending tweet:', error);
        return new Response("Not Tweeted!!", {
            status : 500,
            headers : {
                
            }
        });
      }
}