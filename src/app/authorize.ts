import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAuthToken } from '../_utils/serverUtils';

export const authorize = async () => {
  // NOTE: we need the route handlers for auth to actually be visited
  // in order to set the cookies. Since this is a server side component,
  // it won't run on the browser so a fetch to the route handler won't work.
  // The redirect forces the page to be loaded outside of the Next.JS
  // component framework and loaded directly in the user's browser.

  const path = headers().get('x-current-path');

  if (path?.startsWith('/login') || path?.startsWith('/logged-in')) {
    return;
  }

  // get access token if it doesn't exist
  const accessToken = cookies().get('spotify-auth-token')?.value;
  if (!accessToken && !path?.startsWith('/login')) {
    redirect(`/login?path=${path}`);
  }

  // test the access token
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: getAuthToken(),
    },
  });

  // if the access token has expired, forward to refresh flow
  if (response.status === 401) {
    const refreshToken = cookies().get('spotify-refresh-token')?.value;
    redirect(`/api/refresh-token?refresh_token=${refreshToken}&path=${path}`);
  }
};
