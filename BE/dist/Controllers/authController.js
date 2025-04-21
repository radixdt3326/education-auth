"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reauthentication = exports.logout = exports.register = exports.signIn = void 0;
const crypto_1 = __importDefault(require("crypto"));
const loginAttempts_1 = require("../helpers/loginAttempts");
const insertSessionData_1 = __importDefault(require("../helpers/insertSessionData"));
const common_1 = require("../utils/common");
const common_2 = require("../utils/common");
const signIn = async (req, res, DB) => {
    const { email, password } = req.body;
    const isEmailValidate = (0, common_1.isEmail)(email, "Email");
    if (isEmailValidate)
        return res.status(403).json({ message: "Please enter valid email address" });
    const isPasswordNonEmpty = (0, common_1.nonEmptyStr)(password, "password");
    if (isPasswordNonEmpty)
        return res.status(403).json({ message: "Password should not be an empty" });
    const suppliedPassword = password.trim();
    const Email = email.toLowerCase();
    const loginquery = `
        SELECT
            COUNT(id) AS _count_
        FROM
            login_attempt
        WHERE
            email = $1
            AND attempt_date >= NOW() - INTERVAL '1 minute'
    `;
    let attemptsResult = "";
    try {
        attemptsResult = await DB.query(loginquery, [Email]);
    }
    catch (error) {
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
    let result = "";
    try {
        result = await DB.query(userquery, [Email]);
    }
    catch (error) {
        throw new Error("Error fetching user data");
    }
    if (!(result && result.rows && result.rows.length === 1)) {
        (0, loginAttempts_1.loginAttempt)(DB, email, req, res, false, "User doesn't exist");
    }
    if (!(result && result.rows && result.rows.length === 1)) {
        return res.status(403).json({
            message: "User doesn't exist"
        });
    }
    const userDetail = result.rows[0];
    if (!userDetail.password_algo)
        return res.status(500).json({ message: "Error logging in [2]" });
    const saltRandomBytes = Buffer.from(userDetail.password_salt, "hex");
    const hash = crypto_1.default.createHmac(userDetail.password_algo, saltRandomBytes);
    hash.update(suppliedPassword);
    const passwordHashHex = JSON.stringify(hash.digest("hex"));
    let isSuccessfullLogin = passwordHashHex === userDetail.password_hash;
    let additionalInfo = isSuccessfullLogin ? "" : "Incorrect password";
    (0, loginAttempts_1.loginAttempt)(DB, email, req, res, isSuccessfullLogin, additionalInfo);
    if (passwordHashHex !== JSON.stringify(userDetail.password_hash))
        return res.status(500).json({ message: "INCORRECT_CREDENTIALS_MSG" });
    const sessionToken = await (0, insertSessionData_1.default)(DB, userDetail.id, {
        user_id: userDetail.id,
        user_role: userDetail.role,
        user_email: userDetail.email,
    });
    console.log(userDetail);
    return res.status(200).json({
        sessionToken: sessionToken,
        userID: userDetail.id,
        userrole: userDetail.role,
        useremail: userDetail.email,
        date_created: userDetail.date_created
    });
};
exports.signIn = signIn;
const register = async (req, res, DB) => {
    const { email, password, confirmpassword } = req.body;
    const isEmailValidate = (0, common_1.isEmail)(email, "Email");
    if (isEmailValidate)
        return res.status(403).json({ message: "Please enter valid email address" });
    const isPasswordNonEmpty = (0, common_1.nonEmptyStr)(password, "password");
    if (isPasswordNonEmpty)
        return res.status(403).json({ message: "Password should not be an empty" });
    const passwordCheck = (0, common_1.validatePassword)(password);
    if (passwordCheck)
        return res.status(403).json({ message: "Password should not be an empty" });
    if (password !== confirmpassword)
        return res.status(400).json({ message: "You have not entered a matching password, please try again." });
    const passwordHashDetail = await (0, common_1.genPasswordHash)(password);
    const role = "user";
    const query = `
    INSERT INTO user_table (email, password_salt, password_hash, password_algo , role)
    VALUES ($1, $2, $3, $4 , $5) RETURNING *;
  `;
    try {
        const { rows } = await DB.query(query, [email, passwordHashDetail.salt, passwordHashDetail.hash, passwordHashDetail.algo, role]);
        if (rows.length !== 1)
            return res.status(500).json({ message: "Unknown error [2]" });
        console.log(rows);
    }
    catch (e) {
        if (e.message.indexOf("violates unique constraint") >= 0) {
            return res.status(400).json({ message: "A user with that email already exists" });
        }
        else {
            return res.status(500).json({ message: "Could not register [1]" });
        }
    }
    return res.status(200).json({ message: "User is created with provided credential" });
};
exports.register = register;
const logout = async (req, res, DB) => {
    const headerData = req.headers;
    console.log(JSON.stringify(headerData["x-sessid"]));
    const removeSession = await (0, common_1.removeToken)(DB, JSON.stringify(headerData["x-sessid"]));
    if (removeSession)
        return res.status(200).json({ message: "logout successfully !" });
    return res.status(403).json({ message: "forbidden" });
};
exports.logout = logout;
const reauthentication = async (req, res, DB) => {
    try {
        const heaaderData = req.headers;
        if (!heaaderData["x-sessid"]) {
            return res.status(400).json({ message: "anAuthorize" });
        }
        const sessionData = await (0, common_2.getSessionData)(DB, heaaderData["x-sessid"]);
        if (!sessionData)
            return res.status(403).json({ message: "forbidden User is not logged In" });
        if ((new Date(sessionData['expiry_date'])) < (new Date()))
            return res.status(403).json({ message: "Session is expired ! please login again" });
        return res.status(200).json({
            sessionToken: req.body.sessionToken,
            userID: req.body.userDetail.id,
            useremail: req.body.userDetail.email,
            date_created: req.body.userDetail.date_created
        });
    }
    catch (e) {
        res.status(403).send("not authenticated");
    }
};
exports.reauthentication = reauthentication;
//# sourceMappingURL=authController.js.map