////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Remix, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from "match-sorter";
// @ts-ignore - no types, but it's a tiny function
import sortBy from "sort-by";
import invariant from "tiny-invariant";
import { v4 as uuidv4 } from 'uuid';

type TodoCard = {
  id?: string;
  title?: string;
  description?: string;
  completed?: boolean;
}

export type TodoRecord = TodoCard & {
  id: string;
  createdAt: string;
};

const fakeTodoLists = {
  records: {} as Record<string, TodoRecord>,

  async getAll(): Promise<TodoRecord[]> {
    return Object.keys(fakeTodoLists.records)
      .map((key) => fakeTodoLists.records[key])
      .sort(sortBy("-createdAt", "title"));
  },

  async get(id: string): Promise<TodoRecord | null> {
    return fakeTodoLists.records[id] || null;
  },

  async create(values: TodoCard): Promise<TodoRecord> {
    const id = values.id || Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    const newContact = { id, createdAt, ...values };
    fakeTodoLists.records[id] = newContact;
    return newContact;
  },

  async set(id: string, values: TodoCard): Promise<TodoRecord> {
    const contact = await fakeTodoLists.get(id);
    invariant(contact, `No contact found for ${id}`);
    const updatedContact = { ...contact, ...values };
    fakeTodoLists.records[id] = updatedContact;
    return updatedContact;
  },

  destroy(id: string): null {
    delete fakeTodoLists.records[id];
    return null;
  },
};

export async function getContacts(query?: string | null) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  let contacts = await fakeTodoLists.getAll();
  if (query) {
    contacts = matchSorter(contacts, query, {
      keys: ["first", "last"],
    });
  }
  return contacts.sort(sortBy("last", "createdAt"));
}

export async function createEmptyContact() {
  const contact = await fakeTodoLists.create({});
  return contact;
}

export async function getContact(id: string) {
  return fakeTodoLists.get(id);
}

export async function updateContact(id: string, updates: TodoCard) {
  const contact = await fakeTodoLists.get(id);
  if (!contact) {
    throw new Error(`No contact found for ${id}`);
  }
  await fakeTodoLists.set(id, { ...contact, ...updates });
  return contact;
}

export async function deleteContact(id: string) {
  fakeTodoLists.destroy(id);
}

[
  {
    title: "Learn Remix",
    description: "Learn how to use Remix to build a fullstack app",
    completed: true
  },
  {
    title: "Create a new project",
    description: "Create a new project using Remix",
    completed: false
  }
].forEach((card) => {
  fakeTodoLists.create({
    ...card,
    id: uuidv4(),
  });
});
