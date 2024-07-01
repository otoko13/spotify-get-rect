'use client';

import classNames from 'classnames';
import { usePathname, useRouter } from 'next/navigation';
import styles from './menuTabs.module.scss';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import logoPic from '/src/_images/Spotify_Primary_Logo_RGB_Green.png';
import Link from 'next/link';

interface MenuTab {
  label: string;
  path: string;
}

interface MenuTabsProps {
  tabs: MenuTab[];
  avatarUrl?: string;
}

export default function MenuTabs({ avatarUrl, tabs }: MenuTabsProps) {
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();
  const router = useRouter();

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
      <div className="flex items-center justify-between w-full">
        <div className="flex-shrink pl-4">
          <Link href="/">
            <Image alt="spotify logo" src={logoPic} width={48} height={48} />
          </Link>
        </div>
        <div
          role="tablist"
          className={classNames('tabs tabs-lg flex flex-shrink py-2', {
            [styles.tabs]: scrolled,
          })}
        >
          {tabs.map((tab) => (
            <a
              key={tab.label}
              role="tab"
              className={classNames('tab text-current', styles['custom-tab'])}
              onClick={() => router.push(tab.path)}
            >
              <div
                className={classNames([styles['show-indicator']], {
                  [styles.display]: path === tab.path,
                })}
              />
              {tab.label}
            </a>
          ))}
        </div>
        <div className="avatar mr-4 flex-grow justify-end">
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
  );
}
