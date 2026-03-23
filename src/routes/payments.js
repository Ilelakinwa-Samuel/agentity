const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/auth");
const { listPaymentsForUser } = require("../services/hedera/paymentService");

/**
 * @openapi
 * tags:
 *   - name: Payments
 *     description: Hedera payment history endpoints
 */

/**
 * @openapi
 * /payments/history:
 *   get:
 *     tags: [Payments]
 *     summary: Get payment history for authenticated user
 *     description: Returns Hedera payment history for the logged-in user.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Payment history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "1d95072e-c995-4ecf-8f1a-5db5a3d8a111"
 *                       toAgentId:
 *                         type: string
 *                         example: "ac0d21d5-bb02-4d52-8004-4725488cf007"
 *                       taskExecutionId:
 *                         type: string
 *                         example: "9e75f7fd-fd1c-4b6d-91ab-3ecdb9d8d222"
 *                       amountHbar:
 *                         type: number
 *                         example: 1.5
 *                       hederaTxId:
 *                         nullable: true
 *                         type: string
 *                         example: "0.0.7148109@1710601234.123456789"
 *                       paymentReference:
 *                         nullable: true
 *                         type: string
 *                         example: "PAY-20260316-001"
 *                       status:
 *                         type: string
 *                         example: "paid"
 *                       metadata:
 *                         type: object
 *                         additionalProperties: true
 *                         example:
 *                           taskId: "9e75f7fd-fd1c-4b6d-91ab-3ecdb9d8d222"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-03-16T15:50:00.000Z"
 *       401:
 *         description: Unauthorized
 */
router.get("/history", requireAuth, async (req, res, next) => {
  try {
    const items = await listPaymentsForUser(req.user.id);

    return res.json({
      items: items.map((payment) => ({
        id: payment.id,
        toAgentId: payment.to_agent_id,
        taskExecutionId: payment.task_execution_id,
        amountHbar: Number(payment.amount_hbar),
        hederaTxId: payment.hedera_tx_id,
        paymentReference: payment.payment_reference,
        status: payment.status,
        metadata: payment.metadata,
        createdAt: payment.created_at,
      })),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
