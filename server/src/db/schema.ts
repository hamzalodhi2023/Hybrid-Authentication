import {
  int,
  mysqlTable,
  serial,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created-at").defaultNow().notNull(),
  updatedAt: timestamp("updated-at").defaultNow().onUpdateNow().notNull(),
});

export const sessions = mysqlTable("sessions", {
  id: varchar("id", { length: 24 }).primaryKey().unique(),

  // 🔗 User Relation
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // 🔐 Refresh Token
  token: varchar("token", { length: 500 }).notNull(),

  // 🌍 Network Info
  ipAddress: varchar("ip_address", { length: 100 }).notNull(),
  userAgent: varchar("user_agent", { length: 500 }).notNull(),

  // 💻 Device Details
  device: varchar("device", { length: 100 }),
  browser: varchar("browser", { length: 100 }),
  os: varchar("os", { length: 100 }),

  // 🔄 Session State
  isActive: boolean("is_active").default(true).notNull(),
  revokedAt: timestamp("revoked_at").default(null),

  // ⏳ Expiry
  expiresAt: timestamp("expires_at").notNull(),

  // 📊 Activity Tracking
  lastUsedAt: timestamp("last_used_at"),

  // 📅 Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
