// const maxmind = require("maxmind");
// const path = require("path");
import maxmind from "maxmind";
import path from "path"

export const getLookup = async function () {
	return await maxmind.open(path.join(__dirname, "./GeoLite2Country.mmdb"));
};
