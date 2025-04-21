import apiBaseOrigin from "./apiBaseOrigin";
import axios from 'axios';


export default async function(method : string, endpoint : string, data : object){
	const config = {
		method: method,
		url: apiBaseOrigin + endpoint,
		headers: {
			// "X-CSRF" : "Y",
			"X-SESSID" : localStorage.getItem("sessId"),
		},
		data : {}
	};
	if (data) {
		config.data = data;
	}
	try {
		const res = await axios(config);
		console.log(res);
		return res.data;


	}catch(err){
		return Promise.reject({
			message : err.response.data.message
		})
	}
};
