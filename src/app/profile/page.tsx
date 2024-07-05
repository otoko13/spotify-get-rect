import Profile from '@/_components/profile/Profile';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Your Spotify account info',
};

export default async function ProfilePage() {
  return <Profile />;
}
