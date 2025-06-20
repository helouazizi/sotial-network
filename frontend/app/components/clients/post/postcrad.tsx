import PostMeta from './postMeta';
import PostBody from './postBody';
import PostActions from './postActions';
import PostComment from './postComment';
import { Post } from '@/app/types/post';

export default function PostCard({
  post,
  onPostUpdate,

}: {
  post: Post;
  onPostUpdate: (id: number, updatedPost: Partial<Post>) => void;

}){
  return (
    <div className="post-card">
      <PostMeta author={`test-user`} createdAt="2025-06-11T13:45:00Z" avatarUrl="/avatar.png" />
      <PostBody title={post.title} content={post.content} media={post.media_link} />
      <PostComment   post={post} onPostUpdate={onPostUpdate}/>
      <PostActions post={post} onPostUpdate={onPostUpdate} />
    </div>
  );
}
