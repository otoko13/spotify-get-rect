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
  // eslint-disable-next-line no-unused-vars
  interface Window {
    spotifySdkPlayerReady?: boolean;
    playerBeingUsed?: boolean;
  }
}

export function setPlayerReady() {
  window.spotifySdkPlayerReady = true;
}

export function setPlayerBeingUsed(used: boolean) {
  window.playerBeingUsed = used;
}

export async function waitForSpotifySdkPlayer(): Promise<void> {
  return new Promise(function (resolve) {
    (function waitForReady() {
      if (window.spotifySdkPlayerReady) {
        return resolve();
      }

      setTimeout(waitForReady, 200);
    })();
  });
}
