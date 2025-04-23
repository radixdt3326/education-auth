import { requestBody } from "@/types/type";
import apiBaseOrigin from "./apiBaseOrigin";
import axios from 'axios';


export default async function<T>(method : string, endpoint : string, data? : requestBody):Promise<T>{
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


	}catch(err : any){
		return Promise.reject({
			message : err.response.data.message
		})
	}
};
