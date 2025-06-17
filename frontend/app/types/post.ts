export interface Comment {
  comment: string;
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
  likes: number;
  dislikes: number;
  totalComments: number;
  comments: Comment[]; 
}
