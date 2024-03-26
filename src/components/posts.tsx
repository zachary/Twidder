import { deletePost } from "@/utilities/appwrite";
import { useEffect, useState } from "react";

interface PostInterface {
    owner: string,
    post: string,
    scheduledOn: string,
    $id: string
}

interface PostsParams {
    posts: Array<PostInterface>
}

function Posts({ posts }: PostsParams) {
    const [currentPosts, setCurrentPosts] = useState<Array<PostInterface>>(posts);
    const handleDelete = async (postId : string) => {
        const deletionResult = await deletePost(postId);
        if(deletionResult==="success"){
            const newPosts = posts.filter((post) => post.$id!==postId);
            setCurrentPosts(newPosts);
        }
        else {
            alert("Deletion failed!")
        }
        
    }

    return (
        <div className={`w-full flex flex-col min-h-full items-center justify-around divide-y-2 divide-zinc-800 overflow-y-scroll`}>
            {
                currentPosts.length>0 ? currentPosts.map((post, index) => {
                    return <div key={post.$id} className={`w-full max-w-60 h-12 py-4 text-center flex justify-between items-center gap-5`}>
                       <span className="text-wrap text-ellipsis">
                        {post.post.substring(0,40)+"..."}
                        </span>
                        <span className={`text-red-400 cursor-pointer`}  onClick={()=> {
                            handleDelete(post.$id);
                        }} ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        </span>
                    </div> 
                }) : 
                <div className={`text-cyan-700 text-sm`}>No Posts Scheduled</div>
            }
        </div>
    );
}

export default Posts;