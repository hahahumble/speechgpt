import { Element } from 'react-scroll';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSessionStore } from '../../store/module';
import ConversationItem from './ConversationItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconGhost,
  IconTrash,
  IconVolume,
  IconCheck,
} from '@tabler/icons-react';
import TippyButton from '../base/TippyButton';
import { v4 as uuidv4 } from 'uuid';
import { chatDB } from '../../db';

interface SidebarProps {
  notify: any;
}

function Sidebar({ notify }: SidebarProps) {
  const { i18n } = useTranslation();
  const { sessions, addSession, setCurrentSessionId, clearSessions } = useSessionStore();

  const scrollContainer = useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = useState('');
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const filteredSessions = sessions.filter(session =>
    session.topic.toLowerCase().includes(searchValue.toLowerCase())
  );

  function addNewConversation() {
    const biggestSessionId = sessions.reduce((prev, current) =>
      prev.id > current.id ? prev : current
    ).id;
    addSession({
      id: uuidv4(),
      topic: i18n.t('conversations.new-conversation'),
      messageCount: 0,
    });
    if (scrollContainer.current) {
      scrollContainer.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const deleteTimeoutRef = useRef<number | null>(null);

  const handleDeleteClick = async (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);

      if (deleteTimeoutRef.current !== null) {
        clearTimeout(deleteTimeoutRef.current);
      }

      deleteTimeoutRef.current = window.setTimeout(() => {
        setIsConfirmingDelete(false);
      }, 6000);
    } else {
      clearSessions();
      await chatDB.clearChats();
      notify.allConversationClearNotify();
      setIsConfirmingDelete(false);

      if (deleteTimeoutRef.current !== null) {
        clearTimeout(deleteTimeoutRef.current);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row w-full justify-between space-x-1">
        <div className="border border-slate-200 h-10 rounded-lg px-3 flex flex-row justify-between items-center py-2 w-full">
          <IconSearch className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            className="focus:outline-none text-base text-gray-700 py-1.5 w-full px-3 shadow-sm"
            placeholder={i18n.t('conversations.search') + '...'}
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
        {/*<div className="items-center self-center p-2 hover:bg-gray-100 rounded-lg">*/}
        {/*  <IconFilter className="w-5 h-5 text-gray-400" />*/}
        {/*</div>*/}
      </div>

      <div
        ref={scrollContainer}
        onScroll={() => {
          if (scrollContainer.current) {
            setShowScrollTopButton(scrollContainer.current.scrollTop > 0);
          }
        }}
        className="mt-2 space-y-2 overflow-y-scroll flex-grow"
      >
        <Element name="messages" className="flex-grow rounded-lg space-y-1 h-full">
          {filteredSessions.length === 0 ? (
            <div className="flex-col flex space-y-2 h-full justify-center">
              <IconGhost className={'w-12 h-12 text-slate-400 mx-auto'} />
              <p className="text-center text-slate-400 text-lg">
                {i18n.t('conversations.no-match')}
              </p>
            </div>
          ) : (
            <>
              {/*<TransitionGroup>*/}
              {filteredSessions
                .filter(session => session.liked)
                .map(session => (
                  // <CSSTransition key={session.id} timeout={500} classNames="item">
                  <ConversationItem
                    key={session.id}
                    icon={session.icon}
                    liked={session.liked}
                    id={session.id}
                    title={session.topic}
                    messageCount={session.stats.messageCount}
                    date={session.date}
                    onClick={() => {
                      setCurrentSessionId(session.id);
                    }}
                    notify={notify}
                  />
                  // </CSSTransition>
                ))}
              {/*</TransitionGroup>*/}
              {filteredSessions.some(session => session.liked) && (
                <div className="border-t my-2"></div>
              )}
              {/*<TransitionGroup>*/}
              {filteredSessions
                .filter(session => !session.liked)
                .map(session => (
                  // <CSSTransition key={session.id} timeout={500} classNames="item">
                  <ConversationItem
                    key={session.id}
                    icon={session.icon}
                    liked={session.liked}
                    id={session.id}
                    title={session.topic}
                    messageCount={session.stats.messageCount}
                    date={session.date}
                    onClick={() => {
                      setCurrentSessionId(session.id);
                    }}
                    notify={notify}
                  />
                  // </CSSTransition>
                ))}
              {/*</TransitionGroup>*/}
            </>
          )}
        </Element>
      </div>
      <div className="flex flex-row items-center justify-between space-x-1">
        <button
          className="h-10 flex items-center rounded-lg flex-row hover:bg-slate-100 w-full active:bg-slate-200"
          onClick={addNewConversation}
        >
          <IconPlus className="w-5 h-5 text-slate-500 mx-2" />
          <div className="text-gray-600 select-none">{i18n.t('conversations.new')}</div>
        </button>
        <div className="hover:bg-slate-100 rounded-lg">
          <TippyButton
            tooltip={
              isConfirmingDelete
                ? (i18n.t('conversations.confirm') as string)
                : (i18n.t('conversations.clear-all-conversations') as string)
            }
            icon={
              isConfirmingDelete ? (
                <IconCheck className="w-5 h-5 text-slate-500 stroke-2" />
              ) : (
                <IconTrash className="w-5 h-5 text-slate-500 stroke-2" />
              )
            }
            style="hover:bg-slate-100 active:bg-slate-200"
            onClick={handleDeleteClick}
          />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
