import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const toolHistoryTable = pgTable("tool_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  toolSlug: text("tool_slug").notNull(),
  toolName: text("tool_name").notNull(),
  input: text("input").notNull(),
  output: text("output").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ToolHistory = typeof toolHistoryTable.$inferSelect;
