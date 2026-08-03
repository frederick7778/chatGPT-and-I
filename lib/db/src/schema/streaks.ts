import { pgTable, integer, date, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const streaksTable = pgTable("streaks", {
  userId: integer("user_id").primaryKey().references(() => usersTable.id, { onDelete: "cascade" }),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastCheckinDate: date("last_checkin_date", { mode: "string" }),
  totalCheckins: integer("total_checkins").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type Streak = typeof streaksTable.$inferSelect;
