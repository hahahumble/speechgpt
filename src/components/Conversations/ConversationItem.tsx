import React, { useState, Fragment, useEffect } from 'react';
import { useGlobalStore, useSessionStore } from '../../store/module';
import { Disclosure, Menu, Popover, Transition } from '@headlessui/react';
import { chatDB } from '../../db';
import { useTranslation } from 'react-i18next';
import useOnclickOutside from 'react-cool-onclickoutside';

import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconAdjustmentsHorizontal,
  IconCheck,
  IconStar,
  IconStarFilled,
  IconChevronDown,
  IconStarOff,
} from '@tabler/icons-react';
import Tippy from '@tippyjs/react';
import {
  BlueCircle,
  CyanCircle,
  GreenCircle,
  OrangeCircle,
  PurpleCircle,
  RedCircle,
  VioletCircle,
} from './ConversationIcons';

interface ConversationItemProps {
  id: string;
  icon: string;
  title: string;
  liked: boolean;
  messageCount: number;
  date: string;
  onClick: () => void;
  notify: any;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const icons = [
  { name: 'Red', icon: 'red-circle' },
  { name: 'Orange', icon: 'orange-circle' },
  { name: 'Green', icon: 'green-circle' },
  { name: 'Cyan', icon: 'cyan-circle' },
  { name: 'Blue', icon: 'blue-circle' },
  { name: 'Purple', icon: 'purple-circle' },
  // { name: 'Violet', icon: "violet-circle" },
];

const ConversationItem: React.FC<ConversationItemProps> = ({
  id,
  icon,
  title,
  liked,
  messageCount,
  date,
  onClick,
  notify,
}) => {
  const { i18n } = useTranslation();

  const {
    currentSessionId,
    removeSession,
    updateSession,
    sessions,
    setCurrentSessionId,
    setLiked,
    setIcon,
  } = useSessionStore();

  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const [conversationIcon, setConversationIcon] = useState(icon);
  const { developer } = useGlobalStore();

  const ref = useOnclickOutside(() => {
    setMenuActive(false);
  });

  const handleDeleteClick = async (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);

      setTimeout(() => {
        // Automatically reset isConfirmingDelete state after 10 seconds
        setIsConfirmingDelete(false);
      }, 6000);
    } else {
      if (currentSessionId === id) {
        const otherSessions = sessions.filter(session => session.id !== id);
        if (otherSessions.length > 0) {
          setCurrentSessionId(otherSessions[0].id);
        }
      }

      removeSession({ id: id });
      await chatDB.deleteChatsBySessionId(id);
      notify.deletedNotify();
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTitle(event.target.value);
  };

  const handleTitleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isEditing) {
      handleTitleBlur();
    } else {
      setIsEditing(true);
    }
  };

  const handleTitleBlur = (event?: React.FocusEvent<HTMLInputElement>) => {
    if (event) {
      const newTarget: any = event.relatedTarget;

      if (newTarget && newTarget.id === 'icon-button') {
        return;
      }
    }

    if (currentTitle.trim() === '') {
      notify.cannotBeEmptyNotify();
      setCurrentTitle(title); // Reset to original title
    } else {
      setTimeout(() => {
        setIsEditing(false);
      }, 100);
      updateSession({ id: id, topic: currentTitle });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleTitleBlur();
    }
  };

  const handleLikeClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setLiked({ id: id, liked: !liked });
  };

  const actionList = [
    {
      icon: liked ? IconStarOff : IconStar,
      name: liked ? i18n.t('conversations.unlike') : i18n.t('conversations.like'),
      onClick: handleLikeClick,
    },
    { icon: IconEdit, name: i18n.t('conversations.edit'), onClick: handleTitleEdit },
    {
      icon: isConfirmingDelete ? IconCheck : IconTrash,
      name: isConfirmingDelete ? i18n.t('conversations.confirm') : i18n.t('conversations.delete'),
      onClick: handleDeleteClick,
    },
    // { icon: IconAdjustmentsHorizontal, name: 'Configure' },
  ];

  function ConversationIcon(icon: string) {
    switch (icon) {
      case 'blue-circle':
        return <BlueCircle />;
      case 'red-circle':
        return <RedCircle />;
      case 'green-circle':
        return <GreenCircle />;
      case 'orange-circle':
        return <OrangeCircle />;
      case 'purple-circle':
        return <PurpleCircle />;
      case 'cyan-circle':
        return <CyanCircle />;
      default:
        return <BlueCircle />;
    }
  }

  return (
    <div
      ref={ref}
      className={`group relative h-10 rounded-lg flex flex-row justify-between items-center px-3 hover:cursor-pointer ${
        currentSessionId === id ? 'bg-slate-100' : 'hover:bg-slate-50'
      }`}
      onClick={onClick}
    >
      {isEditing ? (
        <div className="text-left flex items-center space-x-2">
          <Popover as="div" className="flex">
            <Popover.Button id="icon-button" onMouseDown={event => event.stopPropagation()}>
              <Tippy
                content={i18n.t('conversations.change-icon')}
                placement="bottom"
                delay={[300, 0]}
                duration={0}
                hideOnClick={true}
                trigger={'mouseenter'}
                theme={'light'}
                className={'focus:ring-0 outline-0'}
              >
                <div className="py-1 focus:ring-0 outline-0">{ConversationIcon(icon)}</div>
              </Tippy>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Popover.Panel className="z-10 absolute top-7 left-3 mt-2 origin-top-left bg-white divide-y divide-slate-100 rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="w-auto flex-auto overflow-hidden rounded-2xl bg-white text-sm leading-6 ring-1 ring-slate-900/5">
                  <div className="px-4 py-2 flex flex-row space-x-1">
                    {icons.map(item => (
                      <div
                        className="px-1 py-1 hover:ring rounded-full ring-slate-200"
                        key={item.icon}
                        onClick={() => {
                          setIcon({ id: id, icon: item.icon });
                        }}
                      >
                        {ConversationIcon(item.icon)}
                      </div>
                    ))}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>
          <input
            className={`w-44 self-center text-gray-700 bg-transparent border-none focus:ring-0 outline-0 ${
              developer && 'bg-blue-200'
            }`}
            value={currentTitle}
            onChange={handleTitleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleTitleBlur}
            onClick={event => {
              event.stopPropagation();
            }}
            autoFocus
          />
        </div>
      ) : (
        <div className="text-left flex items-center space-x-2">
          {liked && <IconStarFilled className="w-4 h-4 text-yellow-500 flex-nowrap" />}
          {!liked && ConversationIcon(icon)}
          <div className={`text-gray-700 truncate w-44 ${developer && 'bg-blue-200'}`}>
            {currentTitle}
          </div>
        </div>
      )}
      <div className="flex flex-row items-center">
        <div
          className={`right-1 ${
            menuActive ? 'opacity-100' : 'group-hover:opacity-100 sm:opacity-0'
          } transition-colors duration-100 flex flex-row sm:space-x-0.5`}
        >
          <Menu as="div" className="relative ml-3">
            <div>
              <Menu.Button
                className="flex max-w-xs items-center rounded-full text-sm focus:outline-none"
                onClick={() => setMenuActive(!menuActive)}
              >
                <Tippy
                  content={i18n.t('conversations.actions')}
                  placement="bottom"
                  delay={[300, 0]}
                  duration={0}
                  hideOnClick={true}
                  trigger={'mouseenter'}
                  theme={'light'}
                >
                  <div className="mr-1 p-1 font-bold flex flex-row justify-center active:bg-slate-200 hover:bg-slate-100 rounded-lg">
                    <IconDotsVertical className="w-4 h-4 text-gray-500" />
                  </div>
                </Tippy>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-2 z-10 mt-1 w-32 origin-top-right rounded-2xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="p-2">
                  {actionList.map(item => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <div
                          className={classNames(
                            active ? 'bg-slate-100' : '',
                            'relative px-2 py-1.5 text-sm text-gray-600 flex rounded-lg gap-x-2'
                          )}
                          onClick={item.onClick}
                        >
                          <div className="flex flex-none items-center justify-center rounded-lg">
                            <item.icon
                              className="h-5 w-5 text-gray-600 group-hover:text-gray-600"
                              aria-hidden="true"
                            />
                          </div>
                          <div>{item.name}</div>
                        </div>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        <div className="text-gray-500 text-sm items-center bg-slate-100 w-6 h-6 flex justify-center rounded-lg">
          {messageCount}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
