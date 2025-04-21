"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDashboard = void 0;
const common_1 = require("../utils/common");
const getUserDashboard = async (req, res, DB) => {
    const { id } = req.params;
    const isuserIdValid = (0, common_1.isSafeInput)(id);
    if (!isuserIdValid)
        return res.status(403).json({ message: "Please enter valid email id" });
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
};
exports.getUserDashboard = getUserDashboard;
//# sourceMappingURL=userController.js.map