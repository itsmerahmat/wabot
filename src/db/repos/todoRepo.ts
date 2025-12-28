import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../client";
import { todos } from "../schema";

export type Todo = {
  id: number;
  title: string;
  done: boolean;
  createdAt: Date;
};

export async function createTodo(jid: string, title: string): Promise<Todo> {
  const db = getDb();

  const inserted = db.insert(todos).values({ jid, title }).returning().get();

  return {
    id: inserted.id,
    title: inserted.title,
    done: inserted.done,
    createdAt: inserted.createdAt
  };
}

export async function listTodos(jid: string): Promise<Todo[]> {
  const db = getDb();
  const rows = db
    .select()
    .from(todos)
    .where(eq(todos.jid, jid))
    .orderBy(desc(todos.createdAt), desc(todos.id))
    .all();

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    done: row.done,
    createdAt: row.createdAt
  }));
}

export async function markTodoDone(jid: string, id: number): Promise<boolean> {
  const db = getDb();
  const updated = db
    .update(todos)
    .set({ done: true })
    .where(and(eq(todos.jid, jid), eq(todos.id, id)))
    .run();

  return updated.changes > 0;
}

export async function deleteTodo(jid: string, id: number): Promise<boolean> {
  const db = getDb();
  const deleted = db
    .delete(todos)
    .where(and(eq(todos.jid, jid), eq(todos.id, id)))
    .run();

  return deleted.changes > 0;
}
