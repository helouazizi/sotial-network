import { User } from "./chat";

export interface Comment {
  author: User ;
  comment: string;
  created_at: string;
  media_link: string | undefined
}

// export interface Author {
//   user_name?: string | null;
//   first_name?: string | null;
//   last_name?: string | null;
//   avatar?: string | null;
// }

export interface Post {
  id: number;
  content: string;
  title: string;
  author: User;
  created_at: string;
  media_link: string;
  likes: number;
  dislikes: number;
  total_comments: number;
  user_vote: string | null;
}

export interface PostErrors {
  title_error?: string
  body_error?: string
  image_error?: string
  privacy_error?: string
}

export interface Follower  {
  author : User
  id: number;
}

