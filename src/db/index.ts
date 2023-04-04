import Dexie, { Table } from "dexie";
import { Chat } from "./chat";

class ChatDB extends Dexie {
  chat!: Table<Chat>;

  constructor() {
    super("chatDB");
    this.version(2).stores({
      chat: `
        ++id
        `
    });
  }
}

export const db = new ChatDB();
