'use client';

import classNames from 'classnames';
import Image from 'next/image';
import logoPic from '/src/_images/Spotify_Primary_Logo_RGB_Green.png';
import Link from 'next/link';
import { MenuTab } from '../menuTabs/MenuTabs';
import styles from '../menuTabs/menuTabs.module.scss';
import { usePathname } from 'next/navigation';

interface SimpleHeaderProps {
  tabs: MenuTab[];
  avatarUrl?: string;
}

export default function SimpleHeader({ avatarUrl, tabs }: SimpleHeaderProps) {
  const path = usePathname();

  return (
    <div className="flex flex-col flex-grow fixed top-0 left-0 w-full z-30">
      <div className="absolute top-0 left-0 w-full h-full -z-10" />
      <div className="flex items-center justify-between w-full py-2">
        <div className="flex-none pl-4">
          <Link href="/">
            <Image alt="spotify logo" src={logoPic} width={48} height={48} />
          </Link>
        </div>
        <div role="tablist" className="tabs tabs-lg flex flex-shrink">
          {tabs.map((tab) => (
            <Link
              href={tab.path}
              key={tab.label}
              role="tab"
              className={classNames('tab text-current', styles['custom-tab'])}
            >
              <div
                className={classNames(styles['show-indicator'], {
                  [styles.display]: path === tab.path,
                })}
              />
              {tab.label}
            </Link>
          ))}
        </div>
        <div className="flex-grow flex items-center justify-end">
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
