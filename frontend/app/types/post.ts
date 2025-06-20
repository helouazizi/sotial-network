export interface Comment {
  id : number
  author: string;
  comment: string;
  created_at: string;
  likes: number;
  dislikes: number;
  // Add more fields like id, userId, createdAt if needed
}

export interface Post {
  id: number;
  userId: number;
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
