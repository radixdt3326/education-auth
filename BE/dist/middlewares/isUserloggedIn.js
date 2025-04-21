"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserLoggedIn = void 0;
const common_1 = require("../utils/common");
const isUserLoggedIn = async (req, res, next, DB) => {
    try {
        const heaaderData = req.headers;
        if (!heaaderData["x-sessid"]) {
            return res.status(400).json({ message: "anAuthorize" });
        }
        const sessionData = await (0, common_1.getSessionData)(DB, heaaderData["x-sessid"]);
        if (!sessionData)
            return res.status(403).json({ message: "forbidden User is not logged In" });
        if ((new Date(sessionData['expiry_date'])) < (new Date()))
            return res.status(403).json({ message: "Session is expired ! please login again" });
        next();
    }
    catch (e) {
        res.status(403).send("not authenticated");
    }
};
exports.isUserLoggedIn = isUserLoggedIn;
//# sourceMappingURL=isUserloggedIn.js.map