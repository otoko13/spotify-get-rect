'use client';

import { MenuTab } from './MenuTabs';
import { usePathname, useRouter } from 'next/navigation';
import classNames from 'classnames';
import styles from './mobileLinks.module.scss';
import { useCallback, useMemo, useState } from 'react';
import caretDown from '@/_images/caret-down.svg';
import Image from 'next/image';

interface MobileLinksProps {
  className?: string;
  scrolled: boolean;
  tabs: MenuTab[];
}

export default function MobileLinks({ className, tabs }: MobileLinksProps) {
  const [element, setElement] = useState<HTMLUListElement | null>();
  const router = useRouter();
  const path = usePathname();

  const selectedTabs = useMemo(() => {
    const currentTabIndex = tabs.findIndex((tab) => tab.path === path);

    if (currentTabIndex === -1) {
      return null;
    }

    const remainingTabs = [...tabs];
    remainingTabs.splice(currentTabIndex, 1);

    return {
      currentTab: tabs[currentTabIndex],
      remainingTabs,
    };
  }, [path, tabs]);

  const handleClick = useCallback(
    (tab: MenuTab) => {
      const elem = document.activeElement as HTMLDivElement;
      if (elem) {
        elem?.blur();
      }

      router.push(tab.path);
    },
    [router],
  );

  const handleLabelClicked = useCallback(() => {
    if (document.activeElement === element) {
      (document.activeElement as HTMLDivElement)?.blur();
    }
  }, [element]);

  return (
    <details className={classNames('dropdown', className)}>
      <summary
        tabIndex={0}
        role="button"
        className="m-1 no-marker"
        onClick={handleLabelClicked}
        onKeyDown={handleLabelClicked}
      >
        <div
          key={selectedTabs?.currentTab.label}
          className={classNames(
            'tab text-current max-sm:text-md max-sm:mx-1 px-0',
            styles['custom-tab'],
            {
              'max-sm:text-sm':
                selectedTabs?.currentTab?.label &&
                selectedTabs.currentTab.label.length > 14,
            },
          )}
        >
          <div
            className={classNames('relative', styles['show-indicator'], [
              styles.display,
            ])}
            style={{ width: 'calc(100% - 24px)' }}
          ></div>
          {selectedTabs?.currentTab.label}
          <div className="flex justify-center absolute w-9 h-9 -right-2 -bottom-3">
            <Image src={caretDown} width={36} height={36} alt="open" />
          </div>
        </div>
      </summary>
      <ul
        className="dropdown-content menu rounded-none w-52 p-2 shadow z-50 relative"
        style={{ top: 'calc(72px - 0.5rem)' }}
        ref={(e) => setElement(e)}
      >
        <div
          className={classNames(
            'absolute top-0 left-0 w-full h-full -z-10 bg-black',
            styles['blurred-bg'],
            {
              [styles.visible]: true,
            },
          )}
        />
        {selectedTabs?.remainingTabs.map((tab, index) => (
          <li key={index}>
            <button
              key={tab.label}
              role="tab"
              className={classNames(
                'tab text-current text-left justify-start',
                styles['custom-tab'],
                className,
              )}
              onClick={() => handleClick(tab)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}
