"use server"

import authentication from "@/utilities/appwrite/authentication";


export default async function createUser(formData : FormData) {
    const email : string = formData.get("email")?.toString() || "";
    const username : string = formData.get("username")?.toString() || "";
    const password : string = formData.get("password")?.toString() || "";

    console.log(email, username,password)
    if(!email || !password || !username){
        return new Error("Empty data")
    }
    else {
        authentication.signup({
            email,
            password,
            username
        })
    }
}