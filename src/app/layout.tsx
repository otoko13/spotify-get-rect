import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { authorize } from './authorize';

const inter = Inter({ subsets: ['latin'] });

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
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
