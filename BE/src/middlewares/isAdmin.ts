import express from 'express';
import { getUserData } from '../utils/common';

export const isAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction, DB: any) => {
    try {
        // here we can add many checks and layer of security;
        const { id } = req.params;

        const userDetails = await getUserData(DB, id);

        if (userDetails.role == "admin") {
            next();
        }

        return res.status(403).json({ message: "Not authorized to this place" })

    } catch (e) {
        res.status(403).send("not authenticated");
    }
}