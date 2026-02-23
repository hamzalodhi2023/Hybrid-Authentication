RENAME TABLE `users_table` TO `users`;--> statement-breakpoint
ALTER TABLE `users` DROP INDEX `users_table_email_unique`;--> statement-breakpoint
ALTER TABLE `users` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `users` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);