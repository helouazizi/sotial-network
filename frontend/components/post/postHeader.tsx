import { API_URL } from "@/services";
import { GenerateAvatar } from "../profile/ProfileHeader";

export default function PostHeader({ author, firstname, lastname, createdAt, avatarUrl }: { author: string; firstname: string, lastname: string, createdAt: string, avatarUrl: string | undefined }) {
  
  return (
    <div className="post-meta">
      {avatarUrl ? (
        <img
          src={`${API_URL}images/user/${avatarUrl}`}
          alt={`${avatarUrl}`}
          className="avatar-profile post-avatar"
        />
      ) : (
        <div className="avatar-profile post-avatar"><h2>{GenerateAvatar(firstname, lastname)}</h2></div>
      )}
      <span>
        {author} • {createdAt ? new Date(createdAt).toLocaleTimeString() : ""}
      </span>
    </div>
  );
}
