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
  total_comments: number;
  user_vote: string;
  comments: Comment[];
}


export interface PostErrors{
  title_error? : string
  body_error?: string
  image_error? :  string
  privacy_error? : string
}