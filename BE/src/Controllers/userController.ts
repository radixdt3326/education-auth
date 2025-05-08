import express from 'express';
import dotenv from 'dotenv';
import aws from 'aws-sdk'
import { Pool } from 'pg';
import { isSafeInput } from '../utils/common';
import { isSignedUrlUsed, markSignedUrlUsed, storeSignedUrlKey } from '../lib/redis';
import crypto from 'crypto'
import { promisify } from "util"
const randomBytes = promisify(crypto.randomBytes)

dotenv.config()

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

export const getS3SecureUrl = async ( res: express.Response) => {

    const region = process.env.REGION 
    const bucketName = process.env.BUCKET_NAME 
    const accessKeyId = process.env.AWS_ACCESS_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

    const rawBytes = await randomBytes(16)
    const imageName = rawBytes.toString('hex')

    const s3 = new aws.S3({
        region,
        accessKeyId,
        secretAccessKey,
        signatureVersion: 'v4'
    })

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 120
    })

    try {
        const uploadURL = await s3.getSignedUrlPromise('putObject', params);

        if (uploadURL) {
            try {

                await storeSignedUrlKey(imageName, 120)
                return res.status(200).json({
                    signedUrl: uploadURL
                });

            } 
            catch (err : unknown) {

                console.log(err);
                return res.status(500).json({ message: "Internal server error !" });

            }
        }
        else{

            return res.status(500).json({ message: "Internal aws issue : signedurl is not getting generate"});
       
        }

    } catch (err: unknown) {

        console.log(err);
        return res.status(500).json({ message: "Internal server error !" });

    }
   
}

export const isS3URlUsed = async (req: express.Request, res: express.Response) => {

    const { key } = req.body;

    const alreadyUsed: boolean = await isSignedUrlUsed(key);

    if (alreadyUsed) {
        return res.status(400).json({ error: 'Signed URL already used.' });
    }

    await markSignedUrlUsed(key);

    res.status(200).send('Marked as used');
    
}

