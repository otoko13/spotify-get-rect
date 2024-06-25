import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const accessToken = cookies().get('spotify-auth-token')?.value;

  if (!accessToken) {
    redirect('/api/get-auth-token');
  }

  const refreshToken = cookies().get('spotify-refresh-token')?.value;
  await fetch(`${process.env.HOST}/api/refresh-token?refresh_token=${refreshToken}`);

  return (
    process.env.SPOTIFY_CLIENT_SECRET
  );
}
