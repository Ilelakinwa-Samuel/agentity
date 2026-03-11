const express = require("express");
const router = express.Router();

const sequelize = require("../config/database");
const Agent = require("../models/agent");
const AgentMetadata = require("../models/agentMetadata");
const AgentReputation = require("../models/agentReputation");
const AgentBehaviorLog = require("../models/agentBehaviorLog");

const { requireAuth } = require("../middleware/auth");
const { generateFingerprint } = require("../services/fingerprint");
const { logEvent } = require("../services/audit/logEvent");

function parseJsonMaybe(value) {
  if (value == null) return null;
  if (typeof value === "object") return value;
  if (typeof value !== "string") return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function normalizeRegisterPayload(body) {
  const agent_name = body.agent_name || body.agentName || body.name || null;
  const description = body.description || null;
  const agent_type = body.agent_type || body.agentType || null;

  const public_key =
    body.public_key ||
    body.publicKey ||
    body.wallet_address ||
    body.walletAddress ||
    null;

  const api_endpoint = body.api_endpoint || body.apiEndpoint || null;

  const model_name =
    body.model_name || body.modelName || agent_type || "unknown";
  const version = body.version || "unknown";
  const execution_environment =
    body.execution_environment ||
    body.executionEnvironment ||
    (api_endpoint ? "api" : "unknown");

  const metadata_json = parseJsonMaybe(
    body.metadata || body.metadata_json || body.metadataJson,
  );

  return {
    agent_name,
    public_key,
    description,
    agent_type,
    api_endpoint,
    model_name,
    version,
    execution_environment,
    metadata_json,
  };
}

/**
 * @openapi
 * tags:
 *   - name: Agents
 *     description: Agent registry and verification
 */

/**
 * @openapi
 * /agents/register:
 *   post:
 *     tags: [Agents]
 *     summary: Register agent and tie it to the authenticated user
 *     description: Supports both camelCase and snake_case fields. Requires auth.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               agentName: { type: string, example: "My Trading Agent" }
 *               agent_name: { type: string, example: "My Trading Agent" }
 *               description: { type: string, example: "Agent description and capabilities" }
 *               agentType: { type: string, example: "Trading Bot" }
 *               walletAddress: { type: string, example: "0xabc..." }
 *               public_key: { type: string, example: "0xabc..." }
 *               apiEndpoint: { type: string, example: "https://api.example.com/agent" }
 *               metadata: { type: string, example: "{\"key\":\"value\"}" }
 *             required: [agentName, walletAddress]
 *     responses:
 *       201:
 *         description: Agent created
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Agent already exists
 *
 * /agents/my:
 *   get:
 *     tags: [Agents]
 *     summary: Get agents registered by the authenticated user
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of current user's agents
 *       401:
 *         description: Unauthorized
 *
 * /agents/user/{userId}:
 *   get:
 *     tags: [Agents]
 *     summary: Get agents registered by a given user id
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of that user's agents
 *
 * /agents/{id}:
 *   get:
 *     tags: [Agents]
 *     summary: Get agent by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 *
 * /agents/{id}/verify:
 *   post:
 *     tags: [Agents]
 *     summary: Verify agent
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Verified
 *       404:
 *         description: Not found
 */

router.post("/register", requireAuth, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const p = normalizeRegisterPayload(req.body || {});

    if (!p.agent_name || !p.public_key) {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "agent_name (or agentName) and public_key (or walletAddress) are required",
      });
    }

    const existing = await Agent.findOne({
      where: { public_key: p.public_key },
      transaction,
    });

    if (existing) {
      await transaction.rollback();
      return res.status(409).json({
        message: "Agent already exists",
        agentId: existing.id,
      });
    }

    const fingerprint = generateFingerprint(p.public_key);

    const agent = await Agent.create(
      {
        creator_id: req.user.id,
        agent_name: p.agent_name,
        public_key: p.public_key,
        fingerprint,
      },
      { transaction },
    );

    await AgentMetadata.create(
      {
        agent_id: agent.id,
        model_name: p.model_name,
        version: p.version,
        execution_environment: p.execution_environment,
      },
      { transaction },
    );

    await AgentReputation.create(
      {
        agent_id: agent.id,
        score: 0.0,
        risk_level: "low",
      },
      { transaction },
    );

    await AgentBehaviorLog.create(
      {
        agent_id: agent.id,
        event_type: "registration",
        event_payload: {
          description: p.description,
          agentType: p.agent_type,
          walletAddress: p.public_key,
          apiEndpoint: p.api_endpoint,
          metadata: p.metadata_json,
          creator_id: req.user.id,
        },
        risk_score: 0.0,
      },
      { transaction },
    );

    await logEvent(req, {
      action: "agent_register",
      agentId: agent.id,
      payload: {
        description: p.description,
        agentType: p.agent_type,
        walletAddress: p.public_key,
        apiEndpoint: p.api_endpoint,
      },
      transaction,
    });

    await transaction.commit();

    return res.status(201).json({
      id: agent.id,
      creator_id: agent.creator_id,
      agent_name: agent.agent_name,
      fingerprint: agent.fingerprint,
      public_key: agent.public_key,
      status: agent.status,
      description: p.description,
      agentType: p.agent_type,
      walletAddress: p.public_key,
      apiEndpoint: p.api_endpoint,
      metadata: p.metadata_json,
      createdAt: agent.createdAt,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/my", requireAuth, async (req, res) => {
  try {
    const agents = await Agent.findAll({
      where: { creator_id: req.user.id },
      include: [
        { model: AgentMetadata, as: "metadata" },
        { model: AgentReputation, as: "reputation" },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      userId: req.user.id,
      total: agents.length,
      agents,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const agents = await Agent.findAll({
      where: { creator_id: req.params.userId },
      include: [
        { model: AgentMetadata, as: "metadata" },
        { model: AgentReputation, as: "reputation" },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      userId: req.params.userId,
      total: agents.length,
      agents,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const agent = await Agent.findByPk(req.params.id, {
      include: [
        { model: AgentMetadata, as: "metadata" },
        { model: AgentReputation, as: "reputation" },
      ],
    });

    if (!agent) return res.status(404).json({ message: "Agent not found" });

    await logEvent(req, { action: "agent_fetch", agentId: agent.id });

    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/verify", async (req, res) => {
  try {
    const agent = await Agent.findByPk(req.params.id);

    if (!agent) return res.status(404).json({ message: "Agent not found" });

    agent.status = "verified";
    await agent.save();

    await AgentBehaviorLog.create({
      agent_id: agent.id,
      event_type: "verification",
      event_payload: { verified_at: new Date() },
      risk_score: 0.0,
    });

    await logEvent(req, { action: "agent_verify", agentId: agent.id });

    res.json({ message: "Agent verified", agent });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
