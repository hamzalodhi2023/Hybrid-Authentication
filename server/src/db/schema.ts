import {
  int,
  mysqlTable,
  serial,
  varchar,
  timestamp,
  boolean,
  bigint,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: bigint("id", { mode: "number", unsigned: true })
    .primaryKey()
    .autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  isVerified: boolean("is_verified").default(false).notNull(),
  password: varchar({ length: 255 }).notNull(),
  avatar: varchar({ length: 500 }).default("/uploads/default_avatar.png"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const sessions = mysqlTable("sessions", {
  id: varchar("id", { length: 24 }).primaryKey().unique(),

  // 🔗 User Relation
  userId: bigint("user_id", { mode: "number", unsigned: true })
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
  revokedAt: timestamp("revoked_at"),

  // ⏳ Expiry
  expiresAt: timestamp("expires_at").notNull(),

  // 📊 Activity Tracking
  lastUsedAt: timestamp("last_used_at"),

  // 📅 Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const otpVerifications = mysqlTable("otp_verifications", {
  id: varchar("id", { length: 36 }).primaryKey(),

  userId: bigint("user_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  otpHash: varchar("otp_hash", { length: 255 }).notNull(),

  // 🌍 Network Info
  ipAddress: varchar("ip_address", { length: 100 }).notNull(),
  userAgent: varchar("user_agent", { length: 500 }).notNull(),

  // 💻 Device Details
  device: varchar("device", { length: 100 }),
  browser: varchar("browser", { length: 100 }),
  os: varchar("os", { length: 100 }),

  isUsed: boolean("is_used").default(false).notNull(),

  expiresAt: timestamp("expires_at").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
