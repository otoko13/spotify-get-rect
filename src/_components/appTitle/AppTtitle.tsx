import Image from 'next/image';
import logoPic from '/src/_images/Spotify_Full_Logo_RGB_Green.png';

export default function AppTitle() {
  return (
    <div className="flex max-md:flex-col justify-center">
      <Image
        alt="spotify logo"
        className="object-cover"
        src={logoPic}
        style={{
          height: '80px',
          width: 'auto',
          objectFit: 'contain',
        }}
      />
      <div className="text-5xl self-center pl-4 pt-3 whitespace-nowrap">
        Get Rect
      </div>
    </div>
  );
}
