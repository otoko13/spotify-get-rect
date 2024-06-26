import { getAuthToken } from '../serverUtils';

export default async function ProfilePage() {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: getAuthToken(),
    },
  });

  const data = await response.json();

  return <div>{JSON.stringify(data)}</div>;
}
