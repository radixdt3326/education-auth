"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLookup = void 0;
const maxmind_1 = __importDefault(require("maxmind"));
const path_1 = __importDefault(require("path"));
const getLookup = async function () {
    return await maxmind_1.default.open(path_1.default.join(__dirname, "./GeoLite2Country.mmdb"));
};
exports.getLookup = getLookup;
//# sourceMappingURL=getLookup.js.map