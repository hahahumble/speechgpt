import BaseDialog from '../base/Dialog';
import React, { useEffect, useRef, useState } from 'react';
import TippyButton from '../base/TippyButton';
import XIcon from '../Icons/XIcon';
import PlusIcon from '../Icons/PlusIcon';
import ChatIcon from '../Icons/ChatIcon';
import ConversationItem from './ConversationItem';
import { useSessionStore } from '../../store/module';
import { v4 as uuidv4 } from 'uuid';
import { Element } from 'react-scroll';
import SearchIcon from '../Icons/SearchIcon';
import AdjustmentsHorizontalIcon from '../Icons/AdjustmentsHorizontalIcon';
import ArrowUpIcon from '../Icons/ArrowUpIcon';
import { useTranslation } from 'react-i18next';
import SadIcon from '../Icons/SadIcon';

interface ConversationDialogProps {
  open: boolean;
  onClose: () => void;
  notify: any;
}

function ConversationDialog({ open, onClose, notify }: ConversationDialogProps) {
  const { i18n } = useTranslation();

  const { sessions, addSession, setCurrentSessionId } = useSessionStore();

  // const endOfList = useRef<HTMLDivElement>(null);
  const scrollContainer = useRef<HTMLDivElement>(null);

  const [searchValue, setSearchValue] = useState('');
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const filteredSessions = sessions.filter(session =>
    session.topic.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <BaseDialog open={open} onClose={onClose} className="w-120">
      <div className="absolute sm:top-5 sm:right-6 top-6 right-4">
        <TippyButton
          tooltip=""
          onClick={onClose}
          icon={<XIcon className="w-6 h-6 text-gray-500" />}
          style="hover:bg-gray-200 active:bg-gray-300"
        />
      </div>
      <div className="h-150 w-full flex sm:flex-row space-y-3 sm:space-y-0 flex-col sm:justify-center pt-4">
        <div className="w-full h-full px-6 py-4 flex flex-col">
          <div className="flex flex-row items-center space-x-2">
            <ChatIcon className="h-7 w-7 text-gray-700" />
            <div className="text-lg self-start text-gray-700 font-bold">
              {i18n.t('common.conversations-list')}
            </div>
          </div>
          <div className="flex flex-row justify-between pt-6">
            <button
              type="button"
              className="self-end w-fix flex flex-row items-center space-x-2 rounded-lg px-4 py-2 font-medium text-white bg-purple-500 hover:bg-purple-600 active:bg-purple-700"
              onClick={() => {
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
              }}
            >
              <PlusIcon className="h-5 w-5" />
              <div>{i18n.t('conversations.new')}</div>
            </button>

            <div className="flex flex-row items-center space-x-3">
              {/*<AdjustmentsHorizontalIcon className="h-7 w-7 text-gray-400" />*/}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-48 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-base text-gray-700 py-1.5 px-3 border-2 shadow-sm block border-gray-200 rounded-md"
                  placeholder={i18n.t('conversations.search') + '...'}
                  value={searchValue}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
          <div
            ref={scrollContainer}
            onScroll={() => {
              if (scrollContainer.current) {
                setShowScrollTopButton(scrollContainer.current.scrollTop > 0);
              }
            }}
            className="mt-2 space-y-2 overflow-y-scroll h-full"
          >
            <Element name="messages" className="flex-grow rounded-lg space-y-2 h-full">
              {filteredSessions.length === 0 ? (
                <div className="flex-col flex pt-44 space-y-2">
                  <SadIcon className={'w-12 h-12 text-gray-500 mx-auto'} />
                  <p className="text-center text-gray-500 text-lg">
                    {i18n.t('conversations.no-match')}
                  </p>
                </div>
              ) : (
                filteredSessions
                  .sort((a, b) => (b.liked ? 1 : 0) - (a.liked ? 1 : 0))
                  .map(session => (
                    <ConversationItem
                      key={session.id}
                      liked={session.liked}
                      id={session.id}
                      title={session.topic}
                      messageCount={session.stats.messageCount}
                      date={session.date}
                      onClick={() => {
                        setCurrentSessionId(session.id);
                        onClose();
                      }}
                      notify={notify}
                    />
                  ))
              )}
            </Element>
          </div>
        </div>
        {showScrollTopButton && (
          <button
            onClick={() => {
              if (scrollContainer.current) {
                scrollContainer.current.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="fixed bottom-4 right-4 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-white font-medium py-1.5 px-1.5 rounded-full"
          >
            <ArrowUpIcon className="h-4 w-4 text-gray-600" />
          </button>
        )}
      </div>
    </BaseDialog>
  );
}

export default ConversationDialog;
