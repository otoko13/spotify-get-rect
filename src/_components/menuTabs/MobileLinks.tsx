'use client';

import { MenuTab } from './MenuTabs';
import { usePathname, useRouter } from 'next/navigation';
import classNames from 'classnames';
import styles from './menuTabs.module.scss';

interface MobileLinksProps {
  className?: string;
  tabs: MenuTab[];
}

export default function MobileLinks({ className, tabs }: MobileLinksProps) {
  const router = useRouter();
  const path = usePathname();
  const currentTabIndex = tabs.findIndex((tab) => tab.path === path);

  if (currentTabIndex === -1) {
    return null;
  }

  const currentTab = tabs[currentTabIndex];
  const remainingTabs = tabs.toSpliced(currentTabIndex, 1);

  return (
    <div className={classNames('dropdown', className)}>
      <div tabIndex={0} role="button" className="m-1">
        <div
          key={currentTab.label}
          className={classNames('tab text-current', styles['custom-tab'])}
        >
          <div
            className={classNames(styles['show-indicator'], [styles.display])}
          />
          {currentTab.label}
        </div>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        {remainingTabs.map((tab, index) => (
          <li key={index}>
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
              {tab.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
