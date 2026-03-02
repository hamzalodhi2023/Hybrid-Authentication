ALTER TABLE `otp_verifications` ADD `ip_address` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `otp_verifications` ADD `user_agent` varchar(500) NOT NULL;--> statement-breakpoint
ALTER TABLE `otp_verifications` ADD `device` varchar(100);--> statement-breakpoint
ALTER TABLE `otp_verifications` ADD `browser` varchar(100);--> statement-breakpoint
ALTER TABLE `otp_verifications` ADD `os` varchar(100);--> statement-breakpoint
ALTER TABLE `otp_verifications` ADD `is_used` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `otp_verifications` ADD `updated_at` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `otp_verifications` DROP COLUMN `type`;--> statement-breakpoint
ALTER TABLE `otp_verifications` DROP COLUMN `attempts`;