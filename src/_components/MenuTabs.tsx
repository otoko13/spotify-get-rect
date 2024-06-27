'use client';

import classNames from 'classnames';
import { usePathname, useRouter } from 'next/navigation';

interface MenuTab {
  label: string;
  path: string;
}

interface MenuTabsProps {
  tabs: MenuTab[];
}

export default function MenuTabs({ tabs }: MenuTabsProps) {
  const path = usePathname();
  const router = useRouter();

  return (
    <div
      role="tablist"
      className="tabs tabs-bordered tabs-lg mb-10 flex flex-shrink"
    >
      {tabs.map((tab) => (
        <a
          key={tab.label}
          role="tab"
          className={classNames('tab', {
            'tab-active': path === tab.path,
          })}
          onClick={() => router.push(tab.path)}
        >
          {tab.label}
        </a>
      ))}
    </div>
  );
}
