import { getAuthToken } from '@/_utils/serverUtils';
import Image from 'next/image';
import Link from 'next/link';
import SignOut from '../signOut/SignOut';
import classNames from 'classnames';
import AppTitle from '../appTitle/AppTtitle';

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
        'flex flex-col items-center text-center mx-auto py-12 max-md:w-10/12',
        { 'lg:w-6/12': !fullWidth },
      )}
    >
      <AppTitle />
      <div className="flex-none w-36 h-36 rounded-full border-solid border-2 border-gray-600 overflow-hidden mt-8">
        <Image
          alt="avatar image"
          src={avatarUrl}
          objectFit="cover"
          quality={100}
          sizes="100vw"
          style={{ height: 'auto', width: '100%' }}
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
