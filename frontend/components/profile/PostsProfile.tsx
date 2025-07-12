import { Post } from '@/types/post'
import React from 'react'
import PostCard from '../post/postCrad'

const PostsProfile = (props: { posts: Post[] | undefined }) => {
    let { posts } = props

    return (
        <>{
            posts ?
                <section className='post-profile'>
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </section> :
                "ssssss"
        }

        </>

    )
}

export default PostsProfile