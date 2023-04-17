import Dexie, { Table } from 'dexie';
import { Chat } from './chat';

class ChatDB extends Dexie {
  chat!: Table<Chat>;

  constructor() {
    super('chatDB');
    this.version(2).stores({
      chat: `
        ++id
        `,
    });

    this.version(3).stores({
      chat: `
        ++id,
        sessionId
        `,
    });
  }

  async deleteChatsBySessionId(sessionId: string): Promise<void> {
    await this.chat.where('sessionId').equals(sessionId).delete();
  }
}

export const chatDB = new ChatDB();
