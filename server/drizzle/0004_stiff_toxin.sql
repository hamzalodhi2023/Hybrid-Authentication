ALTER TABLE `sessions` DROP INDEX `sessions_token_unique`;--> statement-breakpoint
ALTER TABLE `sessions` MODIFY COLUMN `id` varchar(36) NOT NULL;