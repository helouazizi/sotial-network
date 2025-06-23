"use client"
import Profile from "@/app/components/profile/Profile";
import { ProfileProvider } from "@/app/context/ProfileContext";
import { useParams } from "next/navigation";
interface Props {
  params: {
    id: string;
  };
}
const ProfileServer = () => {
  const params = useParams()
  const id = params.id as string

  return (
    <ProfileProvider profileId={id}>
      <main>
        <Profile />
      </main>
    </ProfileProvider>
  );
};

export default ProfileServer;