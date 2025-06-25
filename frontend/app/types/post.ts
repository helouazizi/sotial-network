export interface Comment {
  author: Author;
  comment: string;
  created_at: string;
  media_link: string | undefined
}

export interface Author {
  user_name: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface Post {
  id: number;
  content: string;
  title: string;
  author: string;
  createdAt: string;
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

export interface Follower extends Author {
  id: number;
}

