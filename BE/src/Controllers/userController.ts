import express from 'express';
import { Pool } from 'pg';
import { isEmail, isSafeInput } from '../utils/common';

/**
 * @swagger
 * /user/user-dashboard:
  *   post:
 *     summary: Retrieve a list of user
 *     description: Fetch user-dashboard data from system
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: user-dashboard data.
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
 *                     example: user
 *                   useremail:
 *                     type : email
 *                     example :  test@tes.com
 *                 
 */

export const getUserDashboard = async (req: express.Request, res: express.Response, DB: Pool) => {

    // Input validation

    const { id } = req.params;

    // const isuserEmailValid = isSafeInput(email);
    // if (!isuserEmailValid) return res.status(403).json({ message: "Please enter valid email address" });

    const isuserIdValid = isSafeInput(id);
    if (!isuserIdValid) return res.status(403).json({ message: "Please enter valid email id" });

    // const isEmailValidate = isEmail(email, "Email");
    // if (isEmailValidate) return res.status(403).json({ message: "Please enter valid email address" });

    const result = await DB.query('SELECT * FROM user_table where id = $1', [id]);

    const userDetails = result.rows[0];
    if (userDetails) {
        return res.status(200).json({
            userID: userDetails.id,
            userrole: userDetails.role,
            useremail: userDetails.email,
            date_created: userDetails.date_created
        });
    }

    return res.status(500).json({ message: "Internal server error !" });
}