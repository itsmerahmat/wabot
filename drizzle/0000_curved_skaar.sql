CREATE TABLE `todos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`jid` text NOT NULL,
	`title` text NOT NULL,
	`done` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT '"2025-12-28T16:45:03.069Z"' NOT NULL
);
