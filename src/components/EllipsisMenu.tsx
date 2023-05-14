import React, { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { IconInfoCircle, IconMessage2, IconSettings } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface EllipsisMenuProps {
  setOpenSetting: (open: boolean) => void;
  setOpenAbout: (open: boolean) => void;
}

function EllipsisMenu({ setOpenSetting, setOpenAbout }: EllipsisMenuProps) {
  const { i18n } = useTranslation();

  function handleFeedback() {
    window.open('https://github.com/hahahumble/speechgpt/issues');
  }

  function handleAbout() {
    setOpenAbout(true);
  }

  const buttons = [
    { name: i18n.t('common.setting'), icon: IconSettings, onClick: () => setOpenSetting(true) },
    { name: i18n.t('common.feedback'), icon: IconMessage2, onClick: handleFeedback },
    { name: i18n.t('common.about'), icon: IconInfoCircle, onClick: handleAbout },
  ];

  return (
    <Popover className="relative">
      <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 bg-slate-200 p-1.5 rounded-lg hover:bg-slate-300 focus:outline-none">
        <EllipsisVerticalIcon className="w-6 h-6 text-slate-500 stroke-2" />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute -right-3 top-5 z-10 mt-5 flex w-screen max-w-max px-4">
          <div className="w-48 max-w-md flex-auto overflow-hidden rounded-2xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
            <div className="p-2">
              {buttons.map(item => (
                <div
                  key={item.name}
                  className="group relative flex gap-x-2 rounded-lg px-2 py-1 hover:bg-slate-100 hover:cursor-pointer"
                  onClick={item.onClick}
                >
                  <div className="flex flex-none items-center justify-center rounded-lg">
                    <item.icon
                      className="h-5 w-5 text-gray-600 group-hover:text-gray-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <div className="text-gray-600">{item.name}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 py-1.5 flex flex-row justify-center">
              <div className="text-slate-400 select-none">
                © {new Date().getFullYear()} SpeechGPT
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

export default EllipsisMenu;
