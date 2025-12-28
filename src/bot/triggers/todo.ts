import type { Trigger } from "../types";
import { createTodo, deleteTodo, listTodos, markTodoDone } from "../../db/repos/todoRepo";

function parseTodoCommand(text: string):
  | { action: "help" }
  | { action: "add"; title: string }
  | { action: "list" }
  | { action: "done"; id: number }
  | { action: "delete"; id: number }
  | undefined {
  if (!text.startsWith("!todo")) return undefined;

  const args = text.replace(/^!todo\s*/i, "").trim();
  if (!args) return { action: "help" };

  const [sub, ...rest] = args.split(/\s+/);
  const tail = rest.join(" ").trim();

  switch ((sub ?? "").toLowerCase()) {
    case "add":
      return { action: "add", title: tail };
    case "list":
      return { action: "list" };
    case "done": {
      const id = Number(rest[0]);
      if (!Number.isFinite(id)) return { action: "help" };
      return { action: "done", id };
    }
    case "del":
    case "delete": {
      const id = Number(rest[0]);
      if (!Number.isFinite(id)) return { action: "help" };
      return { action: "delete", id };
    }
    default:
      // shorthand: `!todo <text>` -> add
      return { action: "add", title: args };
  }
}

function helpText() {
  return [
    "Todo commands:",
    "- !todo add <text>",
    "- !todo list",
    "- !todo done <id>",
    "- !todo delete <id>"
  ].join("\n");
}

export const todoTrigger: Trigger = {
  name: "todo",
  match: ({ text }) => text.startsWith("!todo"),
  handle: async ({ sock, from, text }) => {
    const cmd = parseTodoCommand(text);
    if (!cmd) return;

    if (cmd.action === "help") {
      await sock.sendMessage(from, { text: helpText() });
      return;
    }

    if (cmd.action === "add") {
      const title = cmd.title.trim();
      if (!title) {
        await sock.sendMessage(from, { text: helpText() });
        return;
      }

      const todo = await createTodo(from, title);
      await sock.sendMessage(from, { text: `✅ Added (#${todo.id}): ${todo.title}` });
      return;
    }

    if (cmd.action === "list") {
      const items = await listTodos(from);
      if (items.length === 0) {
        await sock.sendMessage(from, { text: "(Todo kosong)" });
        return;
      }

      const lines = items
        .slice(0, 20)
        .map((t) => `${t.done ? "[x]" : "[ ]"} #${t.id} ${t.title}`);

      await sock.sendMessage(from, {
        text: ["Todo list:", ...lines].join("\n")
      });
      return;
    }

    if (cmd.action === "done") {
      const ok = await markTodoDone(from, cmd.id);
      await sock.sendMessage(from, { text: ok ? "✅ Marked done" : "❌ Not found" });
      return;
    }

    if (cmd.action === "delete") {
      const ok = await deleteTodo(from, cmd.id);
      await sock.sendMessage(from, { text: ok ? "🗑️ Deleted" : "❌ Not found" });
      return;
    }
  }
};
