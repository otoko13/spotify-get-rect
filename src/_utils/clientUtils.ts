export async function clientSpotifyFetch(url: string, options: RequestInit) {
  return await fetch(`https://api.spotify.com/v1/${url}`, options).then(
    (response) => {
      if (response.status === 401) {
        document.location.reload();
      }
      return response;
    },
  );
}
