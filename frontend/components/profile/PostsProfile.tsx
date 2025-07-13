import { Post } from '@/types/post'
import React from 'react'
import PostCard from '../post/postCrad'
import { FaSearchMinus } from 'react-icons/fa'

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
                <div className='empty-data'>
                    <FaSearchMinus />
                    <h4>No data available</h4>
                    <h4>Once data is added, it will appear here.</h4>
                </div>
        }

        </>

    )
}

export default PostsProfile