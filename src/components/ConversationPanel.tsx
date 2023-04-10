import Tips from './Tips';
import TippyButton from './base/TippyButton';
import SpeakerIcon from './Icons/SpeakerIcon';
import TrashIcon from './Icons/TrashIcon';
import CopyIcon from './Icons/CopyIcon';
import { Element } from 'react-scroll';
import React from 'react';
import { marked } from '../helpers/markdown';
import { Chat } from '../db/chat';
import { useTranslation } from 'react-i18next';

interface ConversationPanelProps {
  conversations: Chat[];
  deleteContent: (index: any) => void;
  copyContentToClipboard: (content: string) => void;
  generateSpeech: (content: string) => void;
}

function ConversationPanel({
  conversations,
  deleteContent,
  copyContentToClipboard,
  generateSpeech,
}: ConversationPanelProps) {
  const { i18n } = useTranslation();

  function ChatIcon({ role }: { role: 'user' | 'assistant' | 'system' }) {
    if (role === 'user') {
      return (
        <div className="flex-shrink-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-8 w-8 rounded-full" />
      );
    } else {
      return (
        <div className="flex-shrink-0 bg-gradient-to-r from-amber-500 via-lime-500 to-emerald-500 h-8 w-8 rounded-full" />
      );
    }
  }

  return (
    <Element name="messages" className="flex-grow border border-gray-300 rounded-lg p-4 mb-4">
      {conversations.length === 0 && <Tips />}
      {conversations.map((conversation, index) => (
        <div
          key={conversation.id}
          className="group relative rounded-lg hover:bg-gray-200 p-2 flex flex-row space-x-3 transition-colors duration-100"
        >
          <ChatIcon role={conversation.role} />
          <div className="py-1 text-gray-800 markdown-content">
            {marked(conversation.content ?? '')}
          </div>
          <div className="absolute right-2 top-2 group-hover:opacity-100 opacity-0 transition-colors duration-100 flex flex-row space-x-0.5">
            <TippyButton
              onClick={() => {
                generateSpeech(conversation.content);
              }}
              tooltip={i18n.t('common.replay') as string}
              icon={<SpeakerIcon className="w-4 h-4 text-gray-500" />}
              style="bg-gray-100 hover:bg-gray-100 active:bg-gray-300 rounded-sm opacity-40 hover:opacity-90"
            />
            <TippyButton
              onClick={() => {
                deleteContent(conversation.id);
              }}
              tooltip={i18n.t('common.delete') as string}
              icon={<TrashIcon className="w-4 h-4 text-gray-500" />}
              style="bg-gray-100 hover:bg-gray-100 active:bg-gray-300 rounded-sm opacity-40 hover:opacity-90"
            />
            <TippyButton
              onClick={() => {
                copyContentToClipboard(conversation.content);
              }}
              tooltip={i18n.t('common.copy') as string}
              icon={<CopyIcon className="w-4 h-4 text-gray-500" />}
              style="bg-gray-100 hover:bg-gray-100 active:bg-gray-300 rounded-sm opacity-40 hover:opacity-90"
            />
          </div>
        </div>
      ))}
    </Element>
  );
}

export default ConversationPanel;
