'use client';

import { MenuTab } from './MenuTabs';
import { usePathname, useRouter } from 'next/navigation';
import classNames from 'classnames';
import styles from './menuTabs.module.scss';

interface DesktopLinksProps {
  className?: string;
  tabs: MenuTab[];
}

export default function DesktopLinks({ className, tabs }: DesktopLinksProps) {
  const router = useRouter();
  const path = usePathname();

  return tabs.map((tab) => (
    <a
      key={tab.label}
      role="tab"
      className={classNames(
        'tab text-current',
        styles['custom-tab'],
        className,
      )}
      onClick={() => router.push(tab.path)}
    >
      <div
        className={classNames(styles['show-indicator'], {
          [styles.display]: path === tab.path,
        })}
      />
      {tab.label}
    </a>
  ));
}
