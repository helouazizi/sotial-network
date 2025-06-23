import Profile from "@/app/components/profile/Profile";
interface Props {
  params: {
    id: string;
  };
}
const ProfileServer = async ({ params }: Props) => {
  let { id } = await params;
  return (
    <main>
      <Profile profileid={id} />
    </main>
  );
};

export default ProfileServer;