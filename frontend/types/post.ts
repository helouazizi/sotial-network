export interface Comment {
  comment: string;
  // Add more fields like id, userId, createdAt if needed
}

export interface Post {
  id: number;
  userId: number;
  body: string;
  title: string;
  author: string;
  createdAt: string;
  avatarUrl: string;
  likes: number;
  dislikes: number;
  totalComments: number;
  comments: Comment[]; // ✅ Correct type for comment array
}
