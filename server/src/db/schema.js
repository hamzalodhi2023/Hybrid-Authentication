import {
  int,
  mysqlTable,
  serial,
  varchar,
  timestamp,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created-at").defaultNow().notNull(),
  updatedAt: timestamp("updated-at").defaultNow().onUpdateNow().notNull(),
});
