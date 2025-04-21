"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const common_1 = require("../utils/common");
const isAdmin = async (req, res, next, DB) => {
    try {
        const { id } = req.params;
        const userDetails = await (0, common_1.getUserData)(DB, id);
        if (userDetails.role == "admin") {
            next();
        }
        return res.status(403).json({ message: "Not authorized to this place" });
    }
    catch (e) {
        res.status(403).send("not authenticated");
    }
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=isAdmin.js.map