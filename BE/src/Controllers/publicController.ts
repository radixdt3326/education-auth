import express from 'express';
import { Pool } from 'pg';

/**
 * @swagger
 * /public/about:
  *   get:
 *     summary: Retrieve a list of public data
 *     description: Fetch publicdata from system
 *     responses:
 *       200:
 *         description: public data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: This is educaation site!
 *                 
 */

export const getAboutData = async (req: express.Request, res: express.Response, DB : Pool) => {
   res.status(200).json({message : "This is educaation site!"})
}