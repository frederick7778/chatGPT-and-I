import { Router } from "express";
import { db, favoritesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { getUserFromRequest } from "../lib/auth";
import { getToolBySlug } from "../lib/tools";

const router = Router();

router.get("/favorites", async (req, res): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }

  const favs = await db
    .select()
    .from(favoritesTable)
    .where(eq(favoritesTable.userId, user.id));

  res.json(favs.map((f) => ({
    id: f.id,
    toolSlug: f.toolSlug,
    tool: getToolBySlug(f.toolSlug) ?? { slug: f.toolSlug, name: f.toolSlug, description: "", category: "", creditsPerUse: 1, icon: "Wrench", usageCount: 0 },
    createdAt: f.createdAt.toISOString(),
  })));
});

router.post("/favorites/:toolSlug", async (req, res): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }

  const toolSlug = Array.isArray(req.params.toolSlug) ? req.params.toolSlug[0] : req.params.toolSlug;
  if (!toolSlug) { res.status(400).json({ error: "toolSlug is required" }); return; }

  const tool = getToolBySlug(toolSlug);
  if (!tool) { res.status(404).json({ error: "Tool not found" }); return; }

  const [existing] = await db.select().from(favoritesTable)
    .where(and(eq(favoritesTable.userId, user.id), eq(favoritesTable.toolSlug, toolSlug)));

  if (existing) {
    res.status(201).json({
      id: existing.id,
      toolSlug: existing.toolSlug,
      tool,
      createdAt: existing.createdAt.toISOString(),
    });
    return;
  }

  const [fav] = await db
    .insert(favoritesTable)
    .values({ userId: user.id, toolSlug })
    .returning();

  res.status(201).json({
    id: fav.id,
    toolSlug: fav.toolSlug,
    tool,
    createdAt: fav.createdAt.toISOString(),
  });
});

router.delete("/favorites/:toolSlug", async (req, res): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }

  const toolSlug = Array.isArray(req.params.toolSlug) ? req.params.toolSlug[0] : req.params.toolSlug;
  if (!toolSlug) { res.status(400).json({ error: "toolSlug is required" }); return; }

  await db.delete(favoritesTable)
    .where(and(eq(favoritesTable.userId, user.id), eq(favoritesTable.toolSlug, toolSlug)));

  res.json({ message: "Removed from favorites" });
});

export default router;
