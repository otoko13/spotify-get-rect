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

declare global {
  interface Window {
    spotifySdkPlayerReady?: boolean;
  }
}

export function setPlayerReady() {
  window.spotifySdkPlayerReady = true;
}

export async function waitForSpotifySdkPlayer(): Promise<void> {
  return new Promise(function (resolve, reject) {
    (function waitForReady() {
      if (window.spotifySdkPlayerReady) {
        return resolve();
      }

      setTimeout(waitForReady, 200);
    })();
  });
}
