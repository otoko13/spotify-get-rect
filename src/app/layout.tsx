import classnames from 'classnames';
import type { Metadata } from 'next';
import { CookiesProvider } from 'next-client-cookies/server';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { authorize } from './authorize';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const spotifyCircularFont = localFont({
  src: '../_fonts/CircularSpotifyText-Bold.otf',
});

export const metadata: Metadata = {
  description: 'Browse and play your Spotify library',
  title: {
    default: 'Spotify Get Rect',
    template: 'Spotify Get Rect | %s',
  },
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
      style={{ scrollbarGutter: 'auto' }}
      lang="en"
    >
      <body
        className={classnames(
          inter.className,
          spotifyCircularFont.className,
          'h-full',
        )}
      >
        <CookiesProvider>{children}</CookiesProvider>
      </body>
    </html>
  );
}
