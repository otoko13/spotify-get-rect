import { getAuthToken } from '@/_utils/serverUtils';
import Image from 'next/image';
import logoPic from '/src/_images/Spotify_Full_Logo_RGB_Green.png';
import Link from 'next/link';
import SignOut from '../signOut/SignOut';
import classNames from 'classnames';

interface ProfileProps {
  fullWidth?: boolean;
}

const Profile = async ({ fullWidth = true }: ProfileProps) => {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: getAuthToken(),
    },
  });

  const data = await response.json();
  const avatarUrl = data.images[1].url;

  return (
    <div
      className={classNames(
        'flex flex-col items-center text-center mx-auto my-12',
        { 'w-6/12': !fullWidth },
      )}
    >
      <div className="flex justify-center">
        <Image
          alt="spotify logo"
          src={logoPic}
          style={{
            height: '100%',
            width: 'auto',
            maxHeight: '80px',
          }}
        />
        <span className="text-5xl self-center pl-4 pt-3">Get Rect</span>
      </div>
      <div className="flex-none w-36 h-36 rounded-full border-solid border-2 border-gray-600 overflow-hidden mt-8">
        <Image
          alt="avatar image"
          src={avatarUrl}
          objectFit="cover"
          quality={100}
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
          width={0}
          height={0}
        />
      </div>
      <div className="mt-8 text-lg">
        {data.display_name}
        <p>({data.email})</p>
      </div>
      <div className="mt-8">
        <Link href="/" className="text-green-500">
          Back to homepage
        </Link>
      </div>
      <div className="mt-4">
        <SignOut />
      </div>
    </div>
  );
};

export default Profile;
