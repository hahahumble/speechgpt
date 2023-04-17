import React, { useEffect, useState } from 'react';
import TippyButton from '../base/TippyButton';
import TrashIcon from '../Icons/TrashIcon';
import { useSessionStore } from '../../store/module';
import EditIcon from '../Icons/EditIcon';
import CheckIcon from '../Icons/CheckIcon';
import AdjustmentsHorizontalIcon from '../Icons/AdjustmentsHorizontalIcon';
import { StarIcon } from '@heroicons/react/20/solid';
import StarOutlineIcon from '../Icons/StarOutlineIcon';
import { chatDB } from '../../db';
import { useTranslation } from 'react-i18next';

interface ConversationItemProps {
  id: string;
  title: string;
  liked: boolean;
  messageCount: number;
  date: string;
  onClick: () => void;
  notify: any;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  id,
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
  } = useSessionStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleDeleteClick = async (event: React.MouseEvent) => {
    event.stopPropagation();

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

  const handleTitleBlur = () => {
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

  return (
    <div
      className={`group relative border h-16 rounded-lg flex flex-col justify-center px-4 hover:bg-gray-100 hover:cursor-pointer ${
        currentSessionId === id ? 'border-purple-500 border-2' : ''
      }`}
      onClick={onClick}
    >
      {isEditing ? (
        <input
          className="self-start text-gray-700 bg-transparent border-none focus:ring-0 w-72 pl-1"
          value={currentTitle}
          onChange={handleTitleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleTitleBlur}
          onClick={event => {
            event.stopPropagation();
          }}
          autoFocus
        />
      ) : (
        <div className="self-start text-left flex items-center">
          {liked && <StarIcon className="w-4 h-4 text-yellow-500 mr-1.5 flex-nowrap" />}
          <div className="text-gray-700 truncate group-hover:w-80 w-96">{currentTitle}</div>
        </div>
      )}
      <div className="flex flex-row justify-between text-gray-500 text-sm">
        <div>
          {messageCount}{' '}
          {messageCount > 1 ? i18n.t('conversations.messages') : i18n.t('conversations.message')}
        </div>
        <div>{date}</div>
      </div>
      <div className="absolute right-1 top-1 sm:right-2 sm:top-2 group-hover:opacity-100 sm:opacity-0 transition-colors duration-100 flex flex-row sm:space-x-0.5">
        <TippyButton
          onClick={handleLikeClick}
          tooltip={
            liked
              ? (i18n.t('conversations.unlike') as string)
              : (i18n.t('conversations.like') as string)
          }
          icon={
            <StarOutlineIcon className={`w-4 h-4 ${liked ? 'text-yellow-500' : 'text-gray-500'}`} />
          }
          style="bg-white active:bg-gray-300 rounded-sm"
        />
        <TippyButton
          onClick={handleTitleEdit}
          tooltip={
            isEditing
              ? (i18n.t('conversations.save') as string)
              : (i18n.t('conversations.edit') as string)
          }
          icon={<EditIcon className="w-4 h-4 text-gray-500" />}
          style="bg-white active:bg-gray-300 rounded-sm"
        />
        <TippyButton
          onClick={handleDeleteClick}
          tooltip={
            isConfirmingDelete
              ? (i18n.t('conversations.confirm') as string)
              : (i18n.t('conversations.delete') as string)
          }
          icon={
            isConfirmingDelete ? (
              <CheckIcon className="w-4 h-4 text-gray-500" />
            ) : (
              <TrashIcon className="w-4 h-4 text-gray-500" />
            )
          }
          style="bg-white active:bg-gray-300 rounded-sm"
        />
      </div>
    </div>
  );
};

export default ConversationItem;
