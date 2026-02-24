ALTER TABLE `users` ADD `avatar` varchar(500) DEFAULT '/uploads/default-avatar.png';--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_id_unique` UNIQUE(`id`);