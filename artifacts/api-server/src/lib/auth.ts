import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { db, sessionsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import type { Request } from "express";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export async function createSession(userId: number): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  await db.insert(sessionsTable).values({ userId, token, expiresAt });
  return token;
}

export async function getUserFromRequest(req: Request): Promise<typeof usersTable.$inferSelect | null> {
  const token = req.cookies?.["session"];
  if (!token) return null;

  const [session] = await db
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.token, token));

  if (!session || session.expiresAt < new Date()) return null;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, session.userId));

  return user ?? null;
}

export async function deleteSession(token: string): Promise<void> {
  await db.delete(sessionsTable).where(eq(sessionsTable.token, token));
}
