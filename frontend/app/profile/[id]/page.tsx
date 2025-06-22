import CommonInfo from "@/app/components/profile/CommonInfo";
import { ProfileInt } from "@/app/types/profiles";
import { cookies } from "next/headers";

interface Props {
  params: {
    id: string;
  };
}

const Profile = async ({ params }: Props) => {
  let { id } = await params;
  const cookieStore = cookies(); // 👈 Get incoming request cookies

  const res = await fetch(`http://localhost:8080/api/v1/profile?id=${id}`, {
    method: "GET",
    headers: {
      Cookie: cookieStore.toString(),
    }
  })
  const data: ProfileInt = await res.json()
  console.log(data);
  return (
    <main>
      <CommonInfo />
    </main>
  );
};

export default Profile;