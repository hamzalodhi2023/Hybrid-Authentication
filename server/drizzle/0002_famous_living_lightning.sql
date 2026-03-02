ALTER TABLE `users` RENAME COLUMN `created-at` TO `created_at`;--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN `updated-at` TO `updated_at`;--> statement-breakpoint
ALTER TABLE `users` ADD `is_verified` boolean DEFAULT false NOT NULL;