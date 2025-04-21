"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function insertSessionData(DB, userId, data) {
    try {
        const query = `
        INSERT INTO session_table (
            token,
            date_created,
            expiry_date,
            data,
            user_id
        ) 
        VALUES (
            encode(gen_random_bytes(24), 'hex'),
            NOW() AT TIME ZONE 'UTC', 
            (NOW() AT TIME ZONE 'UTC') + INTERVAL '2 hours',
            $1, 
            $2
        )
        ON CONFLICT (user_id)  
        DO UPDATE 
        SET expiry_date = (NOW() AT TIME ZONE 'UTC') + INTERVAL '2 hours'
        RETURNING *; 
    `;
        const result = await DB.query(query, [JSON.stringify(data), userId]);
        console.log("sessionData -->", result.rows[0]);
        const sessionToken = result.rows[0].token;
        return sessionToken;
    }
    catch (error) {
        console.log(error);
    }
}
;
exports.default = insertSessionData;
//# sourceMappingURL=insertSessionData.js.map