CREATE TABLE `users` (
	`UserId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`UserName` text NOT NULL,
	`UserEmail` text NOT NULL,
	`UserPassword` text NOT NULL,
	`CreatedAt` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_UserEmail_unique` ON `users` (`UserEmail`);