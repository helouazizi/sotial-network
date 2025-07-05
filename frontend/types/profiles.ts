import { Post } from "./post";

export interface ProfileInt {
    id: number;
    nickname: string;
    last_name: string;
    first_name: string;
    email: string;
    avatar: string;
    date_of_birth: string;
    is_private: number;
    about_me: string;
    followers: number;
    followed: number;
    nbPosts: number;
    myAccount: boolean;
    posts: Post[];
    im_follower: boolean;
    subscription?: Subscription;
}
export interface Subscription {
    id: number;
    follower_id: number;
    followed_id: number;
    status: string;
}
