import { cookies } from "next/headers";

export default async function SavedAlbumsPage() {
  const accessToken = cookies().get('spotify-auth-token')?.value;

  const response = await fetch('https://api.spotify.com/v1/me/albums', {
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  });

  const data = await response.json();

  return <div>{JSON.stringify(data)}</div>
}