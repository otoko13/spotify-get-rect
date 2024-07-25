// import Image from 'next/image';
// import underConstructionPic from '/src/_images/under_construction_2.png';
import Link from 'next/link';
import AppTitle from '@/_components/appTitle/AppTtitle';

export default async function Home() {
  return (
    <div className="flex flex-col items-center text-center mx-auto pt-12 max-md:w-10/12">
      <AppTitle />
      {/* <div className="flex-none mt-8">
        <Image
          alt="under construction"
          src={underConstructionPic}
          height={120}
        />
      </div> */}
      <div className="mt-16">
        <Link href="/library/saved-albums" className="text-green-500">
          Spotify library
        </Link>
      </div>
      <div className="mt-8">
        <Link href="/playlists" className="text-green-500">
          Manage playlists
        </Link>
      </div>
      <div className="mt-8">
        <Link href="/profile" className="text-green-500">
          My profile
        </Link>
      </div>
    </div>
  );
}
