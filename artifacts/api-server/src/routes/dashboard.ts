import { Router } from "express";
import { db, creditBalancesTable, streaksTable, toolHistoryTable, favoritesTable } from "@workspace/db";
import { eq, desc, countDistinct, count } from "drizzle-orm";
import { getUserFromRequest } from "../lib/auth";
import { getToolBySlug } from "../lib/tools";

const router = Router();

router.get("/dashboard/summary", async (req, res): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }

  const [credits, streak, recentHistory, favs] = await Promise.all([
    db.select().from(creditBalancesTable).where(eq(creditBalancesTable.userId, user.id)).then((r) => r[0]),
    db.select().from(streaksTable).where(eq(streaksTable.userId, user.id)).then((r) => r[0]),
    db.select().from(toolHistoryTable)
      .where(eq(toolHistoryTable.userId, user.id))
      .orderBy(desc(toolHistoryTable.createdAt))
      .limit(5),
    db.select().from(favoritesTable).where(eq(favoritesTable.userId, user.id)),
  ]);

  const today = new Date().toISOString().split("T")[0]!;

  const [toolsUsedCountResult, totalRunsResult] = await Promise.all([
    db.select({ val: countDistinct(toolHistoryTable.toolSlug) })
      .from(toolHistoryTable).where(eq(toolHistoryTable.userId, user.id)),
    db.select({ val: count(toolHistoryTable.id) })
      .from(toolHistoryTable).where(eq(toolHistoryTable.userId, user.id)),
  ]);

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      createdAt: user.createdAt.toISOString(),
    },
    credits: {
      balance: credits?.balance ?? 0,
      totalEarned: credits?.totalEarned ?? 0,
      totalSpent: credits?.totalSpent ?? 0,
    },
    streak: {
      currentStreak: streak?.currentStreak ?? 0,
      longestStreak: streak?.longestStreak ?? 0,
      lastCheckinDate: streak?.lastCheckinDate ?? null,
      checkedInToday: streak?.lastCheckinDate === today,
      totalCheckins: streak?.totalCheckins ?? 0,
    },
    recentHistory: recentHistory.map((e) => ({
      id: e.id,
      toolSlug: e.toolSlug,
      toolName: e.toolName,
      input: e.input,
      output: e.output,
      createdAt: e.createdAt.toISOString(),
    })),
    favoriteTools: favs
      .map((f) => getToolBySlug(f.toolSlug))
      .filter((t) => t != null),
    toolsUsedCount: Number(toolsUsedCountResult[0]?.val ?? 0),
    totalToolRuns: Number(totalRunsResult[0]?.val ?? 0),
  });
});

export default router;
