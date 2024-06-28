import { getAuthToken } from '@/_utils/serverUtils';

const Profile = async () => {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: getAuthToken(),
    },
  });

  const data = await response.json();

  return <div>{JSON.stringify(data)}</div>;
};

export default Profile;
