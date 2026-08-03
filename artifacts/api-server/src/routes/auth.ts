import { Router } from "express";
import { db, usersTable, creditBalancesTable, streaksTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, createSession, getUserFromRequest, deleteSession } from "../lib/auth";

const router = Router();

router.post("/auth/register", async (req, res): Promise<void> => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    res.status(400).json({ error: "email, password and name are required" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  }

  const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
  if (existing) {
    res.status(409).json({ error: "Email already in use" });
    return;
  }

  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(usersTable)
    .values({ email: email.toLowerCase(), passwordHash, name })
    .returning();

  // Initialize credits and streak records
  await db.insert(creditBalancesTable).values({ userId: user.id, balance: 100, totalEarned: 100, totalSpent: 0 });
  await db.insert(streaksTable).values({ userId: user.id });

  const token = await createSession(user.id);
  res.cookie("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      createdAt: user.createdAt.toISOString(),
    },
  });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = await createSession(user.id);
  res.cookie("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      createdAt: user.createdAt.toISOString(),
    },
  });
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  const token = req.cookies?.["session"];
  if (token) await deleteSession(token);
  res.clearCookie("session");
  res.json({ message: "Logged out" });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    createdAt: user.createdAt.toISOString(),
  });
});

router.patch("/users/profile", async (req, res): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const { name, avatarUrl, bio } = req.body;
  const updates: Record<string, string> = {};
  if (name) updates.name = name;
  if (avatarUrl != null) updates.avatarUrl = avatarUrl;
  if (bio != null) updates.bio = bio;

  const [updated] = await db
    .update(usersTable)
    .set(updates)
    .where(eq(usersTable.id, user.id))
    .returning();

  res.json({
    id: updated.id,
    email: updated.email,
    name: updated.name,
    avatarUrl: updated.avatarUrl,
    bio: updated.bio,
    createdAt: updated.createdAt.toISOString(),
  });
});

export default router;
