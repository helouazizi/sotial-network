
'use client';
import { createContext, useContext, useState, ReactNode } from "react";
import { Post } from "@/app/types/post";

// lets define an interface to declare all values that our context can provide to compnnents
interface PostContextType {
    posts: Post[],
    addPost: (post: Post) => void,
    // commentpost function  ....
    // delet post 
    // update post
}


//  now lets create our context
const PostContext = createContext<PostContextType | undefined>(undefined);



interface PostProviderProps {
    children: ReactNode; // Children are React elements inside <PostProvider>...</PostProvider>
}


// lets create the post provider

export const PostProvider = ({ children }: PostProviderProps) => {
    // lets use a state to hold our posts initialy it an empty array
    const [posts, setpost] = useState<Post[]>([])


    // now lets implements the add post method to prappend the post into the biginning of the arry
    const addPost = (post: Post) => {
        setpost((prev) => [post, ...prev]) // Prepend new post to the beginning of the list
    }

    return (
        <PostContext.Provider value={{ posts, addPost }}>
            {children}
        </PostContext.Provider>
    );
}

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};
