CREATE TABLE `sessions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`token` varchar(500) NOT NULL,
	`ip_address` varchar(100) NOT NULL,
	`user_agent` varchar(500) NOT NULL,
	`device` varchar(100),
	`browser` varchar(100),
	`os` varchar(100),
	`is_active` boolean NOT NULL DEFAULT true,
	`revoked_at` timestamp DEFAULT null,
	`expires_at` timestamp NOT NULL,
	`last_used_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `sessions_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;