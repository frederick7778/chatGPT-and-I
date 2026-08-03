import { Router } from "express";
import { db, creditBalancesTable, creditTransactionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { getUserFromRequest } from "../lib/auth";

const router = Router();

router.get("/credits", async (req, res): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }

  const [bal] = await db.select().from(creditBalancesTable).where(eq(creditBalancesTable.userId, user.id));
  if (!bal) {
    res.json({ balance: 0, totalEarned: 0, totalSpent: 0 });
    return;
  }
  res.json({ balance: bal.balance, totalEarned: bal.totalEarned, totalSpent: bal.totalSpent });
});

router.get("/credits/transactions", async (req, res): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }

  const txns = await db
    .select()
    .from(creditTransactionsTable)
    .where(eq(creditTransactionsTable.userId, user.id))
    .orderBy(desc(creditTransactionsTable.createdAt))
    .limit(50);

  res.json(txns.map((t) => ({
    id: t.id,
    amount: t.amount,
    type: t.type,
    description: t.description,
    createdAt: t.createdAt.toISOString(),
  })));
});

export default router;
