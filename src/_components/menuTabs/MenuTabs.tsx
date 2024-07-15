'use client';

import classNames from 'classnames';
import styles from './menuTabs.module.scss';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import logoPic from '/src/_images/Spotify_Primary_Logo_RGB_Green.png';
import Link from 'next/link';
import DesktopLinks from './DesktopLinks';
import MobileLinks from './MobileLinks';
import Toggle from '../toggle/Toggle';

export interface MenuTab {
  label: string;
  path: string;
}

interface MenuTabsProps {
  onUse3dChanged: (use3d: boolean) => void;
  use3d: boolean;
  tabs: MenuTab[];
  avatarUrl?: string;
}

export default function MenuTabs({
  avatarUrl,
  tabs,
  use3d,
  onUse3dChanged,
}: MenuTabsProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (event: Event) => {
      setScrolled((event.currentTarget as Window).scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col flex-grow fixed top-0 left-0 w-full">
      <div
        className={classNames(
          'absolute top-0 left-0 w-full h-full -z-10',
          styles['blurred-tabs'],
          {
            [styles.visible]: scrolled,
          },
        )}
      />
      <div className="flex items-center justify-between w-full py-2">
        <div className="flex-none pl-4">
          <Link href="/">
            <Image alt="spotify logo" src={logoPic} width={48} height={48} />
          </Link>
        </div>
        <div
          role="tablist"
          className={classNames('tabs tabs-lg flex flex-shrink', {
            [styles.tabs]: scrolled,
          })}
        >
          <DesktopLinks className="max-lg:hidden visible" tabs={tabs} />
          <MobileLinks className="md:visible lg:hidden" tabs={tabs} />
        </div>
        <div className="flex-grow flex items-center justify-end">
          <Toggle label="Go 3D!" on={use3d} onChange={onUse3dChanged} />
          <div className="avatar mr-4">
            <div className="w-12 h-12 rounded-full border-solid border-2 border-gray-600">
              {avatarUrl && (
                <Link href="/profile">
                  <Image
                    alt="avatar image"
                    src={avatarUrl}
                    width={48}
                    height={48}
                  />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
