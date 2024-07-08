import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { authorize } from './authorize';
import classnames from 'classnames';
import localFont from 'next/font/local';
import { CookiesProvider } from 'next-client-cookies/server';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

const spotifyCircularFont = localFont({
  src: '../_fonts/CircularSpotifyText-Bold.otf',
});

export const metadata: Metadata = {
  title: {
    template: 'Spotify Get Rect | %s',
    default: 'Spotify Get Rect',
  },
  description: 'Browse and play your Spotify library',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await authorize();

  return (
    <html
      className="bg-gradient-to-br from-black to-slate-800 h-full"
      lang="en"
    >
      <body
        className={classnames(
          inter.className,
          spotifyCircularFont.className,
          'h-full',
        )}
      >
        <CookiesProvider>
          <>
            {children}
            <Script src="https://sdk.scdn.co/spotify-player.js" />
          </>
        </CookiesProvider>
      </body>
    </html>
  );
}
