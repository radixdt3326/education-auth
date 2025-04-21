import express from 'express';
import { getSessionData } from '../utils/common';

export const isUserLoggedIn = async (req: express.Request, res: express.Response, next: express.NextFunction, DB: any) => {
    try {
        // here we can add many checks and layer of security;
        const heaaderData = req.headers;

        if (!heaaderData["x-sessid"]) {
            return res.status(400).json({ message: "anAuthorize" })
        }

        const sessionData = await getSessionData(DB, heaaderData["x-sessid"])

        if (!sessionData) return res.status(403).json({ message: "forbidden User is not logged In" })

        // console.log("checkdate-->", new Date(sessionData['expiry_date']));

        if ((new Date(sessionData['expiry_date'])) < (new Date())) return res.status(403).json({ message: "Session is expired ! please login again" })

        next();

    } catch (e) {
        res.status(403).send("not authenticated");
    }

}