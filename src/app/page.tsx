import { redirect } from 'next/navigation';

export default async function Home(searchParams?: {
    [key: string]: string | undefined;
}) {
    return process.env.SPOTIFY_CLIENT_SECRET;
}
