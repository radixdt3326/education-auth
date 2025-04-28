import express from 'express';
import { Pool } from 'pg';
import { isSafeInput } from '../utils/common';
/**
 * @swagger
 * /admin/admin-dashboard:
  *   post:
 *     summary: Retrieve a list of admin
 *     description: Fetch admin-dashboard data from system
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: admin-dashboard data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 type: object
 *                 properties:
 *                   userID:
 *                     type: integer
 *                     example: 1
 *                   userrole:
 *                     type: string
 *                     example: admin
 *                   useremail:
 *                     type : email
 *                     example :  test@tes.com
 *                 
 */

/**
 * Retrieves admin dashboard data from the system.
 *
 * @param {express.Request} req - The request object containing the user's input.
 * @param {express.Response} res - The response object to send back to the client.
 * @param {any} DB - The database connection object.
 *
 * @returns {Promise<express.Response>} - A promise that resolves to the response object with the admin dashboard data.
 *
 * @throws Will throw an error if the user's input is invalid.
 *
 * @remarks
 * This function performs the following steps:
 * 1. Validates the user's input.
 * 2. Queries the database for the admin dashboard data.
 * 3. Returns the admin dashboard data in the response object.
 *
 * @example
 * ```typescript
 * const req = { params: { id: 1 } };
 * const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
 * const DB = { query: jest.fn().mockResolvedValue({ rows: [{ id: 1, role: 'admin', email: 'test@test.com', date_created: new Date() }] }) };
 *
 * await getAdminDashboard(req, res, DB);
 * expect(res.status).toHaveBeenCalledWith(200);
 * expect(res.json).toHaveBeenCalledWith({ userID: 1, userrole: 'admin', useremail: 'test@test.com', date_created: expect.any(Date) });
 * ```
 */
export const getAdminDashboard = async (req: express.Request, res: express.Response, DB : Pool) => {
    // Input validation
    const { id } = req.params;
    const isuserIdValid = isSafeInput(id);
    if (!isuserIdValid) return res.status(403).json({ message: "Please enter valid email id" });

    // Query the database
    const result = await DB.query('SELECT * FROM user_table where id = $1', [id]);

    // Process the result
    const userDetails = result.rows[0];
    if (userDetails) {
        return res.status(200).json({
            userID: userDetails.id,
            userrole: userDetails.role,
            useremail: userDetails.email,
            date_created: userDetails.date_created
        });
    }

    // Handle errors
    return res.status(500).json({ message: "Internal server error !" });
}