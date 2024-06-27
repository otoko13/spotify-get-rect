'use client';

import classNames from 'classnames';
import { usePathname, useRouter } from 'next/navigation';
import styles from './menuTabs.module.scss';
import { useEffect, useState } from 'react';

interface MenuTab {
  label: string;
  path: string;
}

interface MenuTabsProps {
  tabs: MenuTab[];
}

export default function MenuTabs({ tabs }: MenuTabsProps) {
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
    <div className="flex flex-col flex-shrink fixed top-0 left-0 w-full">
      <div
        className={classNames(
          'absolute top-0 left-0 w-full h-full',
          styles['blurred-tabs'],
          {
            [styles.visible]: scrolled,
          },
        )}
      />
      <div
        role="tablist"
        className={classNames('tabs tabs-lg flex flex-shrink py-2 w-full', {
          [styles.tabs]: scrolled,
        })}
      >
        {tabs.map((tab) => (
          <a
            key={tab.label}
            role="tab"
            className={classNames('tab text-current', {
              'tab-active': path === tab.path,
            })}
            onClick={() => router.push(tab.path)}
          >
            {tab.label}
          </a>
        ))}
      </div>
    </div>
  );
}
