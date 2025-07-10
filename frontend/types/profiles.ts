import { Post } from "./post";
import { User } from "./user"

export interface ProfileInt {
    user: User
    is_private: number;
    followers: number;
    followed: number;
    nbPosts: number;
    myAccount: boolean;
    posts: Post[];
    im_follower: boolean;
    subscription?: Subscription;
    request_id: string
}
export interface Subscription {
    id: number;
    follower_id: number;
    followed_id: number;
    status: string;
}
