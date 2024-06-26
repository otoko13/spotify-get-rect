const BASE_URL = 'https://api.spotify.com/v1/';

const doFetch = async (segment: string, accessToken: string) => {
  const response = await fetch(`${BASE_URL}${segment}`, {
    headers: {
      Authorization: accessToken,
    },
  });

  return await response.json();
};

export const getProfile = async (accessToken: string) =>
  await doFetch('me', accessToken);

export const getSavedAlbums = async (accessToken: string) =>
  await doFetch('me/albums', accessToken);
