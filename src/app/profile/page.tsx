import Profile from '@/_components/profile/Profile';
import { Metadata } from 'next';

export const metadata: Metadata = {
  description: 'Your Spotify account info',
  title: 'Profile',
};

export default async function ProfilePage() {
  return <Profile />;
}
