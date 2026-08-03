import { Router } from "express";
import { db, toolHistoryTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { getUserFromRequest } from "../lib/auth";
import { getToolBySlug } from "../lib/tools";

const router = Router();

router.get("/history", async (req, res): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }

  const entries = await db
    .select()
    .from(toolHistoryTable)
    .where(eq(toolHistoryTable.userId, user.id))
    .orderBy(desc(toolHistoryTable.createdAt))
    .limit(100);

  res.json(entries.map((e) => ({
    id: e.id,
    toolSlug: e.toolSlug,
    toolName: e.toolName,
    input: e.input,
    output: e.output,
    createdAt: e.createdAt.toISOString(),
  })));
});

router.post("/history", async (req, res): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }

  const { toolSlug, input, output } = req.body;
  if (!toolSlug || input == null || output == null) {
    res.status(400).json({ error: "toolSlug, input, and output are required" });
    return;
  }

  const tool = getToolBySlug(toolSlug);
  const toolName = tool?.name ?? toolSlug;

  const [entry] = await db
    .insert(toolHistoryTable)
    .values({ userId: user.id, toolSlug, toolName, input, output })
    .returning();

  res.status(201).json({
    id: entry.id,
    toolSlug: entry.toolSlug,
    toolName: entry.toolName,
    input: entry.input,
    output: entry.output,
    createdAt: entry.createdAt.toISOString(),
  });
});

router.delete("/history/:id", async (req, res): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw!, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [entry] = await db
    .select()
    .from(toolHistoryTable)
    .where(eq(toolHistoryTable.id, id));

  if (!entry || entry.userId !== user.id) {
    res.status(404).json({ error: "History entry not found" });
    return;
  }

  await db.delete(toolHistoryTable).where(eq(toolHistoryTable.id, id));
  res.json({ message: "Deleted" });
});

export default router;
