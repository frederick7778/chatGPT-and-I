import { Router } from "express";
import { TOOLS, getToolBySlug } from "../lib/tools";

const router = Router();

router.get("/tools", async (_req, res): Promise<void> => {
  res.json(TOOLS);
});

router.get("/tools/:toolSlug", async (req, res): Promise<void> => {
  const slug = Array.isArray(req.params.toolSlug) ? req.params.toolSlug[0] : req.params.toolSlug;
  const tool = getToolBySlug(slug!);
  if (!tool) {
    res.status(404).json({ error: "Tool not found" });
    return;
  }
  res.json(tool);
});

export default router;
