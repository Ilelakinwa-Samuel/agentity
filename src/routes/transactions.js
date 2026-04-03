const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/auth");
const {
  createPolicy,
  formatTransaction,
  getTransactionForUser,
  listPoliciesForUser,
  listTransactionsForUser,
} = require("../services/transactions/transactionService");

/**
 * @openapi
 * tags:
 *   - name: Transactions
 *     description: Unified transaction history and policy management
 */

/**
 * @openapi
 * /transactions/history:
 *   get:
 *     tags: [Transactions]
 *     summary: List transaction history for the authenticated user
 *     description: Returns normalized transaction records including payment and execution traces.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Transaction history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 2
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       agentId:
 *                         nullable: true
 *                         type: string
 *                       agentName:
 *                         nullable: true
 *                         type: string
 *                       taskExecutionId:
 *                         nullable: true
 *                         type: string
 *                       paymentRecordId:
 *                         nullable: true
 *                         type: string
 *                       transactionType:
 *                         type: string
 *                         example: "payment"
 *                       amount:
 *                         nullable: true
 *                         type: number
 *                       status:
 *                         type: string
 *                         example: "paid"
 *                       riskRating:
 *                         nullable: true
 *                         type: string
 *                       txHash:
 *                         nullable: true
 *                         type: string
 *                       metadata:
 *                         type: object
 *                         additionalProperties: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get("/history", requireAuth, async (req, res, next) => {
  try {
    const items = await listTransactionsForUser(req.user.id);

    return res.json({
      total: items.length,
      items: items.map(formatTransaction),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /transactions/policies:
 *   get:
 *     tags: [Transactions]
 *     summary: List transaction policies for the authenticated user
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Transaction policy list
 *       401:
 *         description: Unauthorized
 */
router.get("/policies", requireAuth, async (req, res, next) => {
  try {
    const items = await listPoliciesForUser(req.user.id);

    return res.json({
      total: items.length,
      items: items.map((policy) => ({
        id: policy.id,
        name: policy.name,
        description: policy.description,
        status: policy.status,
        rules: policy.rules,
        createdAt: policy.created_at,
        updatedAt: policy.updated_at,
      })),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /transactions/policies:
 *   post:
 *     tags: [Transactions]
 *     summary: Create a transaction policy
 *     description: |
 *       Creates a user-scoped transaction policy that can be used by the frontend
 *       for approvals, limits, or operational controls around agent transactions.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Default Treasury Policy"
 *               description:
 *                 type: string
 *                 example: "Policy used for standard payment and execution validation."
 *               status:
 *                 type: string
 *                 enum: [active, disabled]
 *                 example: "active"
 *               rules:
 *                 type: object
 *                 additionalProperties: true
 *                 example:
 *                   maxAmount: 100
 *                   allowedTypes:
 *                     - "payment"
 *                     - "execution"
 *     responses:
 *       201:
 *         description: Transaction policy created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   nullable: true
 *                   type: string
 *                 status:
 *                   type: string
 *                   example: "active"
 *                 rules:
 *                   type: object
 *                   additionalProperties: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Missing required policy fields
 *       401:
 *         description: Unauthorized
 */
router.post("/policies", requireAuth, async (req, res, next) => {
  try {
    const { name, description, rules, status } = req.body || {};

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    const policy = await createPolicy({
      userId: req.user.id,
      name: String(name).trim(),
      description: description ? String(description).trim() : null,
      rules: rules && typeof rules === "object" ? rules : {},
      status:
        status && ["active", "disabled"].includes(String(status).trim().toLowerCase())
          ? String(status).trim().toLowerCase()
          : "active",
    });

    return res.status(201).json({
      id: policy.id,
      name: policy.name,
      description: policy.description,
      status: policy.status,
      rules: policy.rules,
      createdAt: policy.created_at,
      updatedAt: policy.updated_at,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /transactions/{id}:
 *   get:
 *     tags: [Transactions]
 *     summary: Get transaction details by id
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction record UUID
 *     responses:
 *       200:
 *         description: Transaction details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */
router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const transaction = await getTransactionForUser(req.params.id, req.user.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.json(formatTransaction(transaction));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
