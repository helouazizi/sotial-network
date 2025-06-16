import PostMeta from './postMeta';
import PostBody from './postBody';
import PostActions from './postActions';
import PostComment from './postComment';
import { Post } from '@/app/types/post';

export default function PostCard({
  post,
  onPostUpdate
}: {
  post: Post;
  onPostUpdate: (id: number, updatedPost: Partial<Post>) => void;
}){
  return (
    <li className="post-card">
      <PostMeta author={`user-${post.userId}`} createdAt="2025-06-11T13:45:00Z" avatarUrl="/avatar.png" />
      <PostBody title={post.title} content={post.body} />
      <PostComment   post={post} onPostUpdate={onPostUpdate}/>
      <PostActions post={post} onPostUpdate={onPostUpdate} />
    </li>
  );
}
