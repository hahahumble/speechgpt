import React, { useEffect, useState, useRef } from 'react';
import { MoonIcon, SunIcon, ComputerDesktopIcon, CheckIcon } from '@heroicons/react/20/solid';
import { Menu } from '@headlessui/react';
import DropdownMenu from './base/DropdownMenu';
import Tippy from '@tippy.js/react';
import 'tippy.js/dist/tippy.css';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '../store/module';

interface AppearanceOption {
  key: 'light' | 'dark' | 'system';
  label: any;
  icon: JSX.Element;
}

function AppearanceSelector() {
  const { i18n } = useTranslation();

  const { appearance, setAppearance } = useGlobalStore();

  const isMount = useRef(true);

  useEffect(() => {
    if (isMount.current) {
      const storedAppearance = localStorage.getItem('appearance');
      if (storedAppearance) {
        setAppearance(storedAppearance);
      }
      isMount.current = false;
    } else {
      switch (appearance) {
        case 'light':
          document.documentElement.classList.remove('dark');
          break;
        case 'dark':
          document.documentElement.classList.add('dark');
          break;
        case 'system':
          const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          if (darkModeMediaQuery.matches) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          break;
      }
      localStorage.setItem('appearance', appearance);
    }
  }, [appearance, setAppearance]);

  const appearanceOptions: AppearanceOption[] = [
    { key: 'light', label: 'Light', icon: <SunIcon className="h-6 w-6" /> },
    { key: 'dark', label: 'Dark', icon: <MoonIcon className="h-6 w-6" /> },
    {
      key: 'system',
      label: 'System',
      icon: <ComputerDesktopIcon className="h-6 w-6" />,
    },
  ];

  const button = (
    <Tippy
      content="Appearance"
      placement="bottom"
      duration={0}
      hideOnClick={true}
      trigger={'mouseenter'}
    >
      <Menu.Button className="text-gray-500 w-10 h-10 justify-center items-center flex flex-row flex text-sm rounded-md focus:outline-none hover:bg-gray-200 active:bg-gray-300">
        {appearanceOptions.find(option => option.key === appearance)?.icon}
      </Menu.Button>
    </Tippy>
  );

  return (
    <DropdownMenu button={button}>
      {appearanceOptions.map(option => (
        <Menu.Item key={option.key}>
          {({ active }) => (
            <button
              className={`${
                active ? 'bg-indigo-500 text-gray-100 active:bg-indigo-600' : 'text-gray-700'
              } group flex rounded-md items-center w-full px-2 py-2 text-sm font-medium`}
              onClick={() => setAppearance(option.key)}
            >
              {option.icon}
              <span className="ml-2">{option.label}</span>
              {appearance === option.key && (
                <CheckIcon
                  className={`${active ? ' text-gray-100' : 'text-gray-700'} ml-auto h-5 w-5`}
                  aria-hidden="true"
                />
              )}
            </button>
          )}
        </Menu.Item>
      ))}
    </DropdownMenu>
  );
}

export default AppearanceSelector;
