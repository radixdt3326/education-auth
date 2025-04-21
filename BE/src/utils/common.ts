import * as EmailValidator from 'email-validator';
import crypto from "crypto";
import util from "util";

export const isEmail = (value : string, name : string) => {
    if (!value) {
        return name + ' not provided';
    }
    if (typeof value !== "string") {
        return name + ' invalid';
    }
    if (!EmailValidator.validate(value)) {
        return name + ' not valid';
    }
}

export const  nonEmptyStr = (value : string, name : string)=> {
    if (!value) {
        return name + ' not provided';
    }
    if (typeof value !== "string") {
        return name + ' invalid';
    }
}

export const validatePassword = (pw : string) => {
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
	return null; // no errors
};

export const genPasswordHash = async function (password : string) {

    const genRandomBytes = util.promisify(crypto.randomBytes);

	const algo = "sha256";
	// 32 random bytes. First 16 bytes are the salt, second 16 bytes are the activation token.
	let randomBytesBuffer = await genRandomBytes(32);
	const saltRandomBytes = randomBytesBuffer.slice(0, 16);
	const hash = crypto.createHmac(algo, saltRandomBytes);
	hash.update(password);
	const passwordHashHex = hash.digest("hex");
	return {
		hash: passwordHashHex,
		salt: saltRandomBytes.toString("hex"),
		activation_token: randomBytesBuffer.slice(16).toString("hex"),
		algo: algo,
	};
};
export const removeToken = async function (DB : any ,sessionId : string) {
	try {
        const query = `DELETE FROM session_table WHERE token = $1 RETURNING *;`;
        const result = await DB.query(query, [JSON.parse(sessionId)]);
        if (result.rowCount > 0) {
            console.log(`✅ Session with token ${sessionId} remove successfully.`);
			return true;
        } else {
            console.log(`⚠️ No session found with token ${sessionId}.`);
			return false; 
        }
    } catch (error) {
        console.error('❌ Error deleting session:', error);
		return false;
    }
};

export const getSessionData = async function (DB : any ,sessionId : any) {
	try {
        const result = await DB.query('SELECT * FROM session_table where token = $1', [sessionId]);
		// console.log(result);
		const userDetails = result.rows[0];
		if(userDetails){
			return userDetails;
		}
		return false;
    } catch (error) {
        console.error('Erroe while getting session details:', error);
		return false;
    }
};


export const getUserData = async function (DB : any ,userId : any) {
	try {
		const result = await DB.query('SELECT * FROM user_table where id = $1', [userId]);;
		// console.log(result);
		const userDetails = result.rows[0];
		if(userDetails){
			return userDetails;
		}
		return false;
    } catch (error) {
        console.error('Error while getting user data:', error);
		return false;
    }
};

export const isSafeInput = (input : string) => {
    const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    return !scriptRegex.test(input);
};

export const removeExpiredSession =  async(DB:any)=>{
	try {
        const query = `DELETE FROM session_table WHERE expiry_date <= NOW() RETURNING *;`;
        const result = await DB.query(query);
    } catch (error) {
        console.error('Error deleting session:', error);
		return false;
    }
}

