CREATE TABLE `sessions` (
	`id` varchar(24) NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	`token` varchar(500) NOT NULL,
	`ip_address` varchar(100) NOT NULL,
	`user_agent` varchar(500) NOT NULL,
	`device` varchar(100),
	`browser` varchar(100),
	`os` varchar(100),
	`is_active` boolean NOT NULL DEFAULT true,
	`revoked_at` timestamp,
	`expires_at` timestamp NOT NULL,
	`last_used_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `sessions_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`avatar` varchar(500) DEFAULT '/uploads/default_avatar.png',
	`created-at` timestamp NOT NULL DEFAULT (now()),
	`updated-at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;