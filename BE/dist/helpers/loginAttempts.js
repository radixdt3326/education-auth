"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAttempt = void 0;
const getLookup_1 = require("../utils/getLookup");
let lookup = null;
const loginAttempt = async function login(DB, email, req, res, isSuccessfulLogin, additional_info) {
    if (!lookup) {
        lookup = await (0, getLookup_1.getLookup)();
        if (!lookup) {
            res.status(500).json({ message: "Error logging in [4]" });
        }
    }
    const ip = req.ip;
    const userAgent = req.headers["user-agent"];
    const geoData = lookup.get(ip);
    let location;
    if (geoData && geoData.country && geoData.country.names) {
        location = geoData.country.names.en;
    }
    else {
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
    }
    catch (error) {
        console.error("❌ Error inserting login attempt:", error);
    }
};
exports.loginAttempt = loginAttempt;
//# sourceMappingURL=loginAttempts.js.map