CREATE TABLE `users_table` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`age` int,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`created-at` timestamp NOT NULL DEFAULT (now()),
	`updated-at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_table_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_table_email_unique` UNIQUE(`email`)
);
