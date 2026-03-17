import { Router } from 'express';
import { evaluateController } from '../controllers/evaluate.controller';

export const evaluateRouter = Router();

/**
 * @openapi
 * /evaluate:
 *   post:
 *     summary: Evaluate subjects against conditions
 *     description: Evaluates a list of subjects against a condition tree and returns match results
 *     tags:
 *       - Evaluation
 *     parameters:
 *       - in: query
 *         name: details
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include detailed evaluation breakdown per condition in response
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EvaluateRequest'
 *           example:
 *             subjects:
 *               - age: 25
 *                 status: active
 *                 role: admin
 *               - age: 17
 *                 status: active
 *                 role: user
 *               - age: 30
 *                 status: inactive
 *                 role: admin
 *             conditions:
 *               logic: AND
 *               conditions:
 *                 - field: age
 *                   operator: gte
 *                   value: 18
 *                 - field: status
 *                   operator: eq
 *                   value: active
 *     responses:
 *       200:
 *         description: Evaluation results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EvaluateResponse'
 *             example:
 *               results:
 *                 - index: 0
 *                   match: true
 *                 - index: 1
 *                   match: false
 *                 - index: 2
 *                   match: false
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
evaluateRouter.post('/', (req, res, next) => evaluateController.evaluate(req, res, next));
