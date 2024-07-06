import Image from 'next/image';
import logoPic from '/src/_images/Spotify_Full_Logo_RGB_Green.png';
import underConstructionPic from '/src/_images/under_construction_2.png';
import Link from 'next/link';

export default async function Home() {
  return (
    <div className="flex flex-col items-center text-center mx-auto pt-12 max-md:w-full lg:w-6/12">
      <div className="flex justify-center w-6/12">
        <Image
          alt="spotify logo"
          src={logoPic}
          style={{
            height: '100%',
            width: 'auto',
            maxHeight: '80px',
          }}
        />
        <div className="text-5xl self-center pl-4 pt-3 whitespace-nowrap">
          Get Rect
        </div>
      </div>
      <div className="flex-none mt-8">
        <Image
          alt="under construction"
          src={underConstructionPic}
          height={120}
        />
      </div>
      <div className="mt-8">
        <Link href="/albums/saved-albums" className="text-green-500">
          Albums
        </Link>
      </div>
      <div className="mt-4">
        <Link href="/profile" className="text-green-500">
          My profile
        </Link>
      </div>
    </div>
  );
}
