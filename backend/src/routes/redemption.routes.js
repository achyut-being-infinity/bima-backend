const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const adminController = require("../modules/admin/admin.controller");

/**
 * @swagger
 * /redemptions:
 *   get:
 *     summary: List all redemptions
 *     description: Retrieves all redemptions, optionally filtered by ?status=. Requires ADMIN role.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [REQUESTED, APPROVED, SHIPPED, DELIVERED, REJECTED]
 *         description: Optional status filter
 *     responses:
 *       200:
 *         description: Redemptions retrieved successfully
 *       400:
 *         description: Invalid status filter
 *       401:
 *         description: Missing or invalid authentication token
 *       403:
 *         description: Requires ADMIN role
 *       500:
 *         description: Unexpected server error
 */
router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  adminController.getAllRedemptions,
);

/**
 * @swagger
 * /redemptions/{id}:
 *   patch:
 *     summary: Update a redemption
 *     description: Update status, expected delivery date, and/or admin note. Setting status to REJECTED triggers an atomic coin refund and inventory restock. Requires ADMIN role.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the redemption
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [REQUESTED, APPROVED, SHIPPED, DELIVERED, REJECTED]
 *               expectedDeliveryAt:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               adminNote:
 *                 type: string
 *                 nullable: true
 *               rejectionReason:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Redemption updated successfully
 *       400:
 *         description: Invalid request body or attempting to alter a rejected redemption
 *       401:
 *         description: Missing or invalid authentication token
 *       403:
 *         description: Requires ADMIN role
 *       404:
 *         description: Redemption not found
 *       500:
 *         description: Unexpected server error
 */
router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  adminController.updateRedemption,
);

module.exports = router;
