const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/auth");
const SmartContractAudit = require("../models/smartContractAudit");
const { analyzeSourceCode } = require("../services/audit/contractAuditService");
const { logEvent } = require("../services/audit/logEvent");

/**
 * @openapi
 * tags:
 *   - name: Audits
 *     description: Smart contract audit endpoints
 */

/**
 * @openapi
 * /audits:
 *   post:
 *     tags: [Audits]
 *     summary: Create and run a smart contract audit
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [contractName, sourceType]
 *             properties:
 *               contractName:
 *                 type: string
 *                 example: "MyContract"
 *               sourceType:
 *                 type: string
 *                 enum: [paste, github]
 *               sourceCode:
 *                 type: string
 *               githubUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Audit completed
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { contractName, sourceType, sourceCode, githubUrl } = req.body || {};

    if (!contractName || !sourceType) {
      return res
        .status(400)
        .json({ message: "contractName and sourceType are required" });
    }

    if (!["paste", "github"].includes(sourceType)) {
      return res
        .status(400)
        .json({ message: "sourceType must be 'paste' or 'github'" });
    }

    if (sourceType === "paste" && !sourceCode) {
      return res
        .status(400)
        .json({ message: "sourceCode is required for paste audits" });
    }

    if (sourceType === "github" && !githubUrl) {
      return res
        .status(400)
        .json({ message: "githubUrl is required for github audits" });
    }

    const analysis = analyzeSourceCode(sourceCode || "", contractName);

    const audit = await SmartContractAudit.create({
      user_id: req.user.id,
      contract_name: contractName,
      source_type: sourceType,
      source_code: sourceCode || null,
      github_url: githubUrl || null,
      risk_level: analysis.riskLevel,
      consensus_score: analysis.consensusScore,
      status: "completed",
      findings: analysis.findings,
      summary: analysis.summary,
      result_payload: analysis.resultPayload,
    });

    await logEvent(req, {
      action: "contract_audit_create",
      payload: {
        auditId: audit.id,
        contractName,
        sourceType,
        riskLevel: audit.risk_level,
      },
    });

    return res.json({
      id: audit.id,
      contractName: audit.contract_name,
      riskLevel: audit.risk_level,
      consensusScore: audit.consensus_score,
      status: audit.status,
      createdAt: audit.created_at,
      findings: audit.findings,
      summary: audit.summary,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /audits/history:
 *   get:
 *     tags: [Audits]
 *     summary: Get audit history for authenticated user
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Audit history
 *       401:
 *         description: Unauthorized
 */
router.get("/history", requireAuth, async (req, res, next) => {
  try {
    const audits = await SmartContractAudit.findAll({
      where: { user_id: req.user.id },
      order: [["created_at", "DESC"]],
      limit: 50,
    });

    return res.json({
      items: audits.map((audit) => ({
        id: audit.id,
        contractName: audit.contract_name,
        riskLevel: audit.risk_level,
        consensusScore: audit.consensus_score,
        status: audit.status,
        createdAt: audit.created_at,
      })),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /audits/{id}:
 *   get:
 *     tags: [Audits]
 *     summary: Get full audit result by id
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Full audit result
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const audit = await SmartContractAudit.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!audit) {
      return res.status(404).json({ message: "Audit not found" });
    }

    return res.json({
      id: audit.id,
      contractName: audit.contract_name,
      sourceType: audit.source_type,
      sourceCode: audit.source_code,
      githubUrl: audit.github_url,
      riskLevel: audit.risk_level,
      consensusScore: audit.consensus_score,
      status: audit.status,
      findings: audit.findings,
      summary: audit.summary,
      createdAt: audit.created_at,
      result: audit.result_payload,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
