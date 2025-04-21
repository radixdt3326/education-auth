// const getApiBaseDomain = (loc : any, env : any) => {
// 	if (env.NEXT_PUBLIC_API_URL) {
// 		return env.NEXT_PUBLIC_API_URL;
// 	}
// 	if (loc.port == "16000") {
// 		return loc.hostname + ":13000";
// 	}
// 	if (loc.host.indexOf("public-web-app") >= 0) {
// 		const replacement = env.NODE_ENV === "development" ? "stage-controller" : "production-controller";
// 		return loc.host.replace(/public-web-app/g, replacement);
// 	}
// 	if (loc.host.indexOf("www.") === 0) {
// 		// strip out the 'www.'
// 		return "api" + loc.host.slice(3);
// 	}
// 	return "http://localhost:4000/api/";
// };

const apiBaseOrigin = process.env.NEXT_PUBLIC_API_URL 

export default apiBaseOrigin;
