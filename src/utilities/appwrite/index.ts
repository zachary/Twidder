import { Client, ID, Account, Databases, Permission, Role, Query } from "appwrite";
import {convertToTweet} from "../gemini";

const getAppwriteClient = () => {
    const appwriteEndpoint : string = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
    const appwriteProjectID : string = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
    // console.log(appwriteEndpoint,appwriteProjectID);
    const client = new Client();
    client
        .setEndpoint(appwriteEndpoint)
        .setProject(appwriteProjectID);
    return client;
}

const createDocument = async (tweet : string) : Promise<string> => {
    const dbId : string = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
    const collectionId : string = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION!;
    const client = getAppwriteClient();
    try {
        const account = new Account(client);
        const user = await account.get();
        const db = await new Databases(client);
        const docRef = await db.createDocument(dbId,collectionId, ID.unique(), {
            scheduledOn : new Date(),
            post: tweet,
            owner : user.$id
        }, [
            Permission.write(Role.users()),
            Permission.read(Role.any()),                  // Anyone can view this document
            Permission.update(Role.user(user.$id)),      // Writers can update this document        // Admins can update this document
            Permission.delete(Role.user(user.$id)), // User 5c1f88b42259e can delete this document       // Admins can delete this document
        ]);
        return docRef.$id;
    } catch (error) {
        // console.log(error);
        return "failed";
    }
    
}

const getDocuments = async (userId : string) => {
    const dbId : string = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
    const collectionId : string = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION!;
    const client = getAppwriteClient();
    try {
        if(userId.length===0) throw new Error("No User Found!");
        const account = new Account(client);
        const db = await new Databases(client);
        const docsList = await db.listDocuments(dbId, collectionId,[
            Query.equal("owner",userId),
            Query.orderAsc("$createdAt")
        ]);
        const docs = new Array(...docsList.documents);
        // console.log(docs);
        return docs;
    } catch (error) {
        // console.log(error);
        // console.log("Not fetched!")
        return [];
    }
}

const deletePost = async (postId : string) => {
    const dbId : string = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
    const collectionId : string = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION!;
    const client = getAppwriteClient();
    try {
        const account = new Account(client);
        const db = await new Databases(client);
        const session = await account.get();

        await db.deleteDocument(dbId, collectionId, postId);
        
        // console.log("Deleted!");
        return "success";
    } catch (error) {
        // console.log(error);
        // console.log("Not deleted!!")
        return "failed";
    }
}

export default getAppwriteClient;
export {ID, createDocument, getDocuments, deletePost};