import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import creditsRouter from "./credits";
import streaksRouter from "./streaks";
import toolsRouter from "./tools";
import historyRouter from "./history";
import favoritesRouter from "./favorites";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(creditsRouter);
router.use(streaksRouter);
router.use(toolsRouter);
router.use(historyRouter);
router.use(favoritesRouter);
router.use(dashboardRouter);

export default router;
