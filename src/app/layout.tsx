import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { authorize } from './authorize';
import classnames from 'classnames';
import localFont from 'next/font/local';
import { CookiesProvider } from 'next-client-cookies/server';

const inter = Inter({ subsets: ['latin'] });

const spotifyCircularFont = localFont({
  src: '../_fonts/CircularSpotifyText-Bold.otf',
});

export const metadata: Metadata = {
  title: 'Spotify Get Rect',
  description: 'Fancy Spotify recommendations',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await authorize();

  return (
    <html className="bg-transparent" lang="en">
      <body
        className={classnames(
          inter.className,
          spotifyCircularFont.className,
          'bg-none',
        )}
      >
        <CookiesProvider>{children}</CookiesProvider>
      </body>
    </html>
  );
}
