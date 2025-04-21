// const sendLoginSecurityEmail = require("./common/sendLoginSecurityEmail");
// const getLookup = require("./common/getLookup");
import { getLookup } from '../utils/getLookup';
import express from 'express';

let lookup : any = null;

export const loginAttempt = async function login(DB  : any, email : string, req: express.Request, res : express.Response ,isSuccessfulLogin : boolean , additional_info : string) {
	if (!lookup) {
		lookup = await getLookup();
		if (!lookup) {
			// ctx.throw(500, "Error logging in [4]");
            res.status(500).json({message: "Error logging in [4]"});
		}
	}
	const ip = req.ip;
	const userAgent = req.headers["user-agent"];
	// let geoData = lookup.get('14.137.0.10'); // Australia
	// let geoData = lookup.get('5.196.125.50'); // Germany
	const geoData = lookup.get(ip);
	let location;

	if (geoData && geoData.country && geoData.country.names) {
		location = geoData.country.names.en;
	} else {
		location = "";
	}

    const query = `
        INSERT INTO login_attempt (
            email,
            ip_address,
            user_agent,
            location,
            is_successful,
            additional_info,
            attempt_date
        ) VALUES (
            $1, $2, $3, $4, $5, $6, NOW()
        );
    `;

    const values = [email, ip, userAgent, location, isSuccessfulLogin, ""];

    try {
        await DB.query(query, values);
        console.log("✅ Login attempt recorded successfully!");
    } catch (error) {
        console.error("❌ Error inserting login attempt:", error);
    }
};
