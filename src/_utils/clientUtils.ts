export const getSpotifyUrl = (endpoint: string): string =>
  `https://api.spotify.com/v1/${endpoint}`;

export async function clientSpotifyFetch(url: string, options: RequestInit) {
  return await fetch(getSpotifyUrl(url), options).then((response) => {
    if (response.status === 401) {
      document.location.reload();
    }
    return response;
  });
}
