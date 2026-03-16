const express = require("express");
const router = express.Router();

const Agent = require("../models/agent");
const AgentWallet = require("../models/agentWallet");
const { requireAuth } = require("../middleware/auth");
const { logEvent } = require("../services/audit/logEvent");

/**
 * @openapi
 * tags:
 *   - name: Wallets
 *     description: Hedera wallet linkage for agents
 */

/**
 * @openapi
 * /wallets/link:
 *   post:
 *     tags: [Wallets]
 *     summary: Link a Hedera wallet to an authenticated user's agent
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [agentId, hederaAccountId, hederaPublicKey]
 *             properties:
 *               agentId:
 *                 type: string
 *               hederaAccountId:
 *                 type: string
 *                 example: "0.0.123456"
 *               hederaPublicKey:
 *                 type: string
 *               kmsKeyId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Linked wallet
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Agent not found
 */
router.post("/link", requireAuth, async (req, res, next) => {
  try {
    const { agentId, hederaAccountId, hederaPublicKey, kmsKeyId } =
      req.body || {};

    const trimmedAgentId = agentId?.trim();
    const trimmedHederaAccountId = hederaAccountId?.trim();
    const trimmedHederaPublicKey = hederaPublicKey?.trim();
    const trimmedKmsKeyId = kmsKeyId?.trim();

    if (!trimmedAgentId || !trimmedHederaAccountId || !trimmedHederaPublicKey) {
      return res.status(400).json({
        message: "agentId, hederaAccountId, and hederaPublicKey are required",
      });
    }

    const agent = await Agent.findOne({
      where: {
        id: trimmedAgentId,
        creator_id: req.user.id,
      },
    });

    if (!agent) {
      return res.status(404).json({ message: "Agent not found for this user" });
    }

    await AgentWallet.upsert(
      {
        agent_id: agent.id,
        hedera_account_id: trimmedHederaAccountId,
        hedera_public_key: trimmedHederaPublicKey,
        kms_key_id: trimmedKmsKeyId || null,
        status: "linked",
      },
      { returning: true },
    );

    const wallet = await AgentWallet.findOne({
      where: { agent_id: agent.id },
    });

    await logEvent(req, {
      action: "wallet_link",
      agentId: agent.id,
      payload: {
        hederaAccountId: trimmedHederaAccountId,
        kmsKeyId: trimmedKmsKeyId || null,
      },
    });

    return res.json({
      id: wallet.id,
      agentId: wallet.agent_id,
      hederaAccountId: wallet.hedera_account_id,
      hederaPublicKey: wallet.hedera_public_key,
      kmsKeyId: wallet.kms_key_id,
      status: wallet.status,
      createdAt: wallet.created_at,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
