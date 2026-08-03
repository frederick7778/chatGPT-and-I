import { Router } from "express";
import { db, streaksTable, creditBalancesTable, creditTransactionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getUserFromRequest } from "../lib/auth";

const router = Router();

function getTodayString(): string {
  return new Date().toISOString().split("T")[0]!;
}

function calculateStreakReward(streak: number): number {
  if (streak >= 30) return 25;
  if (streak >= 14) return 15;
  if (streak >= 7) return 10;
  if (streak >= 3) return 7;
  return 5;
}

function isStreakMilestone(streak: number): boolean {
  return [3, 7, 14, 30, 60, 100].includes(streak);
}

router.get("/streaks", async (req, res): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }

  const [streak] = await db.select().from(streaksTable).where(eq(streaksTable.userId, user.id));
  if (!streak) {
    res.json({ currentStreak: 0, longestStreak: 0, lastCheckinDate: null, checkedInToday: false, totalCheckins: 0 });
    return;
  }

  const today = getTodayString();
  res.json({
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    lastCheckinDate: streak.lastCheckinDate,
    checkedInToday: streak.lastCheckinDate === today,
    totalCheckins: streak.totalCheckins,
  });
});

router.post("/streaks/checkin", async (req, res): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }

  const today = getTodayString();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]!;

  const [streak] = await db.select().from(streaksTable).where(eq(streaksTable.userId, user.id));
  if (!streak) { res.status(500).json({ error: "Streak record not found" }); return; }

  if (streak.lastCheckinDate === today) {
    res.status(400).json({ error: "Already checked in today" });
    return;
  }

  // Calculate new streak
  let newStreak = 1;
  if (streak.lastCheckinDate === yesterday) {
    newStreak = streak.currentStreak + 1;
  }
  const newLongest = Math.max(newStreak, streak.longestStreak);
  const creditsEarned = calculateStreakReward(newStreak);
  const milestone = isStreakMilestone(newStreak);

  // Update streak
  await db.update(streaksTable).set({
    currentStreak: newStreak,
    longestStreak: newLongest,
    lastCheckinDate: today,
    totalCheckins: streak.totalCheckins + 1,
  }).where(eq(streaksTable.userId, user.id));

  // Update credits
  const [bal] = await db.select().from(creditBalancesTable).where(eq(creditBalancesTable.userId, user.id));
  const newBalance = (bal?.balance ?? 0) + creditsEarned;
  const newTotalEarned = (bal?.totalEarned ?? 0) + creditsEarned;

  await db.update(creditBalancesTable).set({
    balance: newBalance,
    totalEarned: newTotalEarned,
  }).where(eq(creditBalancesTable.userId, user.id));

  // Record transaction
  await db.insert(creditTransactionsTable).values({
    userId: user.id,
    amount: creditsEarned,
    type: "earn",
    description: newStreak > 1
      ? `Daily check-in reward (${newStreak}-day streak)`
      : "Daily check-in reward",
  });

  const message = milestone
    ? `🔥 ${newStreak}-day streak milestone! You earned ${creditsEarned} credits!`
    : newStreak > 1
    ? `${newStreak} days in a row! You earned ${creditsEarned} credits.`
    : `Welcome back! You earned ${creditsEarned} credits.`;

  res.json({ creditsEarned, newStreak, newBalance, message, isStreakMilestone: milestone });
});

export default router;
