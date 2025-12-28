PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_todos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`jid` text NOT NULL,
	`title` text NOT NULL,
	`done` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT '"2025-12-28T16:45:16.035Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_todos`("id", "jid", "title", "done", "created_at") SELECT "id", "jid", "title", "done", "created_at" FROM `todos`;--> statement-breakpoint
DROP TABLE `todos`;--> statement-breakpoint
ALTER TABLE `__new_todos` RENAME TO `todos`;--> statement-breakpoint
PRAGMA foreign_keys=ON;