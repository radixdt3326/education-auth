"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeExpiredSession = exports.isSafeInput = exports.getUserData = exports.getSessionData = exports.removeToken = exports.genPasswordHash = exports.validatePassword = exports.nonEmptyStr = exports.isEmail = void 0;
const EmailValidator = __importStar(require("email-validator"));
const crypto_1 = __importDefault(require("crypto"));
const util_1 = __importDefault(require("util"));
const isEmail = (value, name) => {
    if (!value) {
        return name + ' not provided';
    }
    if (typeof value !== "string") {
        return name + ' invalid';
    }
    if (!EmailValidator.validate(value)) {
        return name + ' not valid';
    }
};
exports.isEmail = isEmail;
const nonEmptyStr = (value, name) => {
    if (!value) {
        return name + ' not provided';
    }
    if (typeof value !== "string") {
        return name + ' invalid';
    }
};
exports.nonEmptyStr = nonEmptyStr;
const validatePassword = (pw) => {
    if (!pw) {
        return "Password not provided";
    }
    if (pw.length < 8) {
        return "Password must be at least 8 characters.";
    }
    if (!pw.match(/[a-z]/)) {
        return "Password must contain at least one lowercase letter.";
    }
    if (!pw.match(/[A-Z]/)) {
        return "Password must contain at least one uppercase letter.";
    }
    if (!pw.match(/[0-9]/)) {
        return "Password must contain at least one number.";
    }
    if (!pw.match(/\W/)) {
        return "Password must contain at least one special character.";
    }
    return null;
};
exports.validatePassword = validatePassword;
const genPasswordHash = async function (password) {
    const genRandomBytes = util_1.default.promisify(crypto_1.default.randomBytes);
    const algo = "sha256";
    let randomBytesBuffer = await genRandomBytes(32);
    const saltRandomBytes = randomBytesBuffer.slice(0, 16);
    const hash = crypto_1.default.createHmac(algo, saltRandomBytes);
    hash.update(password);
    const passwordHashHex = hash.digest("hex");
    return {
        hash: passwordHashHex,
        salt: saltRandomBytes.toString("hex"),
        activation_token: randomBytesBuffer.slice(16).toString("hex"),
        algo: algo,
    };
};
exports.genPasswordHash = genPasswordHash;
const removeToken = async function (DB, sessionId) {
    try {
        const query = `DELETE FROM session_table WHERE token = $1 RETURNING *;`;
        const result = await DB.query(query, [JSON.parse(sessionId)]);
        if (result.rowCount > 0) {
            console.log(`✅ Session with token ${sessionId} remove successfully.`);
            return true;
        }
        else {
            console.log(`⚠️ No session found with token ${sessionId}.`);
            return false;
        }
    }
    catch (error) {
        console.error('❌ Error deleting session:', error);
        return false;
    }
};
exports.removeToken = removeToken;
const getSessionData = async function (DB, sessionId) {
    try {
        const result = await DB.query('SELECT * FROM session_table where token = $1', [sessionId]);
        const userDetails = result.rows[0];
        if (userDetails) {
            return userDetails;
        }
        return false;
    }
    catch (error) {
        console.error('Erroe while getting session details:', error);
        return false;
    }
};
exports.getSessionData = getSessionData;
const getUserData = async function (DB, userId) {
    try {
        const result = await DB.query('SELECT * FROM user_table where id = $1', [userId]);
        ;
        const userDetails = result.rows[0];
        if (userDetails) {
            return userDetails;
        }
        return false;
    }
    catch (error) {
        console.error('Error while getting user data:', error);
        return false;
    }
};
exports.getUserData = getUserData;
const isSafeInput = (input) => {
    const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    return !scriptRegex.test(input);
};
exports.isSafeInput = isSafeInput;
const removeExpiredSession = async (DB) => {
    try {
        const query = `DELETE FROM session_table WHERE expiry_date <= NOW() RETURNING *;`;
        const result = await DB.query(query);
    }
    catch (error) {
        console.error('Error deleting session:', error);
        return false;
    }
};
exports.removeExpiredSession = removeExpiredSession;
//# sourceMappingURL=common.js.map