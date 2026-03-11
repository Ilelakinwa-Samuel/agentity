const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/auth");
const { buildDashboard } = require("../services/dashboard/buildDashboard");

/**
 * @openapi
 * tags:
 *   - name: Dashboard
 *     description: User dashboard aggregation endpoints
 */

/**
 * @openapi
 * /dashboard/overview:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard overview for the authenticated user
 *     description: Requires auth (Bearer token or agentity_jwt cookie). The overview is built from the authenticated user's id in the JWT.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Dashboard payload for frontend
 *       401:
 *         description: Unauthorized
 */
router.get("/overview", requireAuth, async (req, res, next) => {
  try {
    const dashboard = await buildDashboard(req.user);
    res.json(dashboard);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
