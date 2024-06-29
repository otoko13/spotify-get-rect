import Image from 'next/image';
import logoPic from '/src/_images/Spotify_Full_Logo_RGB_Green.png';
import underConstructionPic from '/src/_images/under_construction_2.png';
import Link from 'next/link';

export default async function Home() {
  return (
    <div className="flex flex-col items-center text-center mx-auto my-12 w-6/12">
      <div className="flex justify-center">
        <Image
          alt="spotify logo"
          src={logoPic}
          height={64}
          objectFit={'contain'}
        />
        <span className="text-5xl self-center pl-4 pt-3">Get Rect</span>
      </div>
      <div className="flex-none mt-8">
        <Image
          alt="under construction"
          src={underConstructionPic}
          height={240}
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
