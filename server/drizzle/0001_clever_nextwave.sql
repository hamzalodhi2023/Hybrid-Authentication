CREATE TABLE `otp_verifications` (
	`id` varchar(24) NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	`otp_hash` varchar(255) NOT NULL,
	`type` enum('email_verify','reset_password','two_factor') NOT NULL,
	`attempts` int NOT NULL DEFAULT 0,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `otp_verifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `otp_verifications` ADD CONSTRAINT `otp_verifications_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;