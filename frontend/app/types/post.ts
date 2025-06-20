export interface Comment {
  author: string;
  comment: string;
  created_at: string;
}

export interface Post {
  id: number;
  content: string;
  title: string;
  author: string;
  createdAt: string;
  media: string;
  media_link: string;
  likes: number;
  dislikes: number;
  totalComments: number;
  comments: Comment[];
}
