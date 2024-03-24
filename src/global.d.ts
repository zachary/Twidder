import { NextRequest } from "next/server"
declare global {
    declare interface TwitterRequest extends NextRequest {
        body : {
            post : string,
            username : string
        }
    }
}