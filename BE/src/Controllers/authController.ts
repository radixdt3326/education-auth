import express, { json } from 'express';
import crypto from "crypto";
import { loginAttempt } from '../helpers/loginAttempts';
import insertSessionData from '../helpers/insertSessionData';
import { isEmail, nonEmptyStr, validatePassword, genPasswordHash, removeToken } from '../utils/common';
import { getSessionData } from '../utils/common';
import { Pool, QueryResult } from 'pg';

/**
 * @swagger
 * components:
 *   schemas:
 *     SignInRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: User's email address
 *         password:
 *           type: string
 *           description: User's password
 *     SignInResponse:
 *       type: object
 *       properties:
 *         sessionToken:
 *           type: string
 *           example: ertyuioplkjhgfd
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsIn..."
 *         userID :
 *           type : string
 *           example : 1
 *         userrole:
 *           type : string
 *           example: user
 *         useremail :
 *           type : string
 *           example : test@test.com
 */


/**
 * @swagger
 * /auth/signin:
  *   post:
 *     summary: User sign-in
 *     description: used to signin in system
 *     requestBody :
 *        required : true
 *        content:
 *        application/json:
 *        schema:
 *          $ref: '#/components/schemas/SignInRequest'
 *     responses:
 *       200:
 *         description: Successful login.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SignInResponse'
 *       400:
 *         description : Invalid body
 *       401 :
 *         description : Invalid Credentials
 *                 
 */

export const signIn = async (req: express.Request, res: express.Response, DB: Pool) => {
    const { email, password } = req.body;

    const isEmailValidate = isEmail(email, "Email");
    if (isEmailValidate) return res.status(403).json({ message: "Please enter valid email address" });

    const isPasswordNonEmpty = nonEmptyStr(password, "password")
    if (isPasswordNonEmpty) return res.status(403).json({ message: "Password should not be an empty" });

    const suppliedPassword = password.trim();

    const Email = email.toLowerCase();

    // const { rows } = await DB.query('SELECT * FROM user_table',);
    // console.log("rows -->" , rows);

    const loginquery = `
        SELECT
            COUNT(id) AS _count_
        FROM
            login_attempt
        WHERE
            email = $1
            AND attempt_date >= NOW() - INTERVAL '1 minute'
    `;
    let attemptsResult: QueryResult
    try {
        // Execute the query
        attemptsResult = await DB.query(loginquery, [Email]);
    } catch (error) {
        console.error("❌ Error executing query:", error);
        throw new Error("Error fetching login attempts");
    }

    if (parseInt(attemptsResult.rows[0]._count_, 10) > 4) {
        return res.status(400).json({ message: "You have entered your username and password incorrectly and must wait 1 minute to try again" });
    }

    const userquery = `
        SELECT
            id,
            email,
            role,
            password_hash,
            password_algo,
            password_salt
        FROM
            user_table
        WHERE
            email = $1
    `;
    let result: QueryResult 
    try {
        result = await DB.query(userquery, [Email]);

    } catch (error) {
        throw new Error("Error fetching user data");
    }


    if (!(result && result.rows && result.rows.length === 1)) {
        loginAttempt(DB, email, req, res, false, "User doesn't exist");
    }

    if (!(result && result.rows && result.rows.length === 1)) {
        return res.status(403).json({
            message: "User doesn't exist"
        });
    }

    const userDetail = result.rows[0];
    if (!userDetail.password_algo) return res.status(500).json({ message: "Error logging in [2]" });

    const saltRandomBytes = Buffer.from(userDetail.password_salt, "hex");
    const hash = crypto.createHmac(userDetail.password_algo, saltRandomBytes);
    hash.update(suppliedPassword);
    const passwordHashHex = JSON.stringify(hash.digest("hex"));

    let isSuccessfullLogin = passwordHashHex === userDetail.password_hash;
    let additionalInfo = isSuccessfullLogin ? "" : "Incorrect password";

    loginAttempt(DB, email, req, res, isSuccessfullLogin, additionalInfo);

    if (passwordHashHex !== JSON.stringify(userDetail.password_hash)) return res.status(500).json({ message: "INCORRECT_CREDENTIALS_MSG" });

    const sessionToken = await insertSessionData(DB, userDetail.id, {
        user_id: userDetail.id,
        user_role: userDetail.role,
        user_email: userDetail.email,
    });
    console.log(userDetail)
    return res.status(200).json(
        {
            sessionToken: sessionToken,
            userID: userDetail.id,
            userrole: userDetail.role,
            useremail: userDetail.email,
            date_created: userDetail.date_created
        })
}

export const register = async (req: express.Request, res: express.Response, DB: Pool) => {

    const { email, password, confirmpassword } = req.body;

    const isEmailValidate = isEmail(email, "Email");
    if (isEmailValidate) return res.status(403).json({ message: "Please enter valid email address" });

    const isPasswordNonEmpty = nonEmptyStr(password, "password")
    if (isPasswordNonEmpty) return res.status(403).json({ message: "Password should not be an empty" });

    const passwordCheck = validatePassword(password);
    // console.log("ispassword-->" + isPasswordNonEmpty)
    if (passwordCheck) return res.status(403).json({ message: "Password should not be an empty" });


    if (password !== confirmpassword) return res.status(400).json({ message: "You have not entered a matching password, please try again." });

    const passwordHashDetail = await genPasswordHash(password);

    const role = "user"

    const query = `
    INSERT INTO user_table (email, password_salt, password_hash, password_algo , role)
    VALUES ($1, $2, $3, $4 , $5) RETURNING *;
  `;

    try {
        // console.log("role -->", role);

        const { rows } = await DB.query(query, [email, passwordHashDetail.salt, passwordHashDetail.hash, passwordHashDetail.algo, role]);
        // only one result should be returned
        if (rows.length !== 1) return res.status(500).json({ message: "Unknown error [2]" })
        console.log(rows)
        // ctx.assert(rows.length === 1, 500, "Unknown error [2]");
    } catch (e) {
        // prevent users from having the same email address
        if (e.message.indexOf("violates unique constraint") >= 0) {
            // ctx.throw(400, "A user with that email already exists");
            return res.status(400).json({ message: "A user with that email already exists" });
        } else {
            return res.status(500).json({ message: "Could not register [1]" });
        }
    }

    return res.status(200).json({ message: "User is created with provided credential" })
}

export const logout = async (req: express.Request, res: express.Response, DB: Pool) => {

    const headerData = req.headers;

    console.log(JSON.stringify(headerData["x-sessid"]))

    const removeSession = await removeToken(DB, JSON.stringify(headerData["x-sessid"]))

    if (removeSession) return res.status(200).json({ message: "logout successfully !" })

    return res.status(403).json({ message: "forbidden" })

}

export const reauthentication = async (req: express.Request, res: express.Response, DB: Pool) => {
    try {
        // here we can add many checks and layer of security;
        const heaaderData = req.headers;

        if (!heaaderData["x-sessid"]) {
            return res.status(400).json({ message: "anAuthorize" })
        }

        const sessionData = await getSessionData(DB, heaaderData["x-sessid"] as string)

        if (!sessionData) return res.status(403).json({ message: "forbidden User is not logged In" })

        if ((new Date(sessionData['expiry_date'])) < (new Date())) return res.status(403).json({ message: "Session is expired ! please login again" })



        return res.status(200).json(
            {
                sessionToken: req.body.sessionToken,
                userID: req.body.userDetail.id,
                useremail: req.body.userDetail.email,
                date_created: req.body.userDetail.date_created
            })

    } catch (e) {
        res.status(403).send("not authenticated");
    }

}