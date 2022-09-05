"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLOUDINARY_CONFIG = exports.config = exports.EMAIL_ACCESS_TOKEN = exports.EMAIL_REFRESH_TOKEN = exports.EMAIL_CLIENT_SECRET = exports.EMAIL_CLIENT_ID = exports.EMAIL_USER = exports.COOKIE_DURATION = exports.COOKIE_SECRET = exports.LOGIN_URL = exports.PROTOCOL = exports.HOST = exports.PORT = exports.SITE_NAME = void 0;
var tslib_1 = require("tslib");
var dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
exports.SITE_NAME = "Vollie";
exports.PORT = +(process.env.PORT || 0) || 4000;
exports.HOST = process.env.HOST || "localhost";
exports.PROTOCOL = process.env.PROTOCOL || "http";
exports.LOGIN_URL = process.env.LOGIN_URL || "".concat(exports.PROTOCOL, "://").concat(exports.HOST, "/login");
exports.COOKIE_SECRET = process.env.COOKIE_SECRET || "d2y3hjaksd09apok23465r";
exports.COOKIE_DURATION = 1000 * 60 * 60 * (+(process.env.COOKIE_DURATION || 0) || 24);
exports.EMAIL_USER = process.env.EMAIL_USER || "";
exports.EMAIL_CLIENT_ID = process.env.EMAIL_CLIENT_ID || "";
exports.EMAIL_CLIENT_SECRET = process.env.EMAIL_CLIENT_SECRET || "";
exports.EMAIL_REFRESH_TOKEN = process.env.EMAIL_REFRESH_TOKEN || "";
exports.EMAIL_ACCESS_TOKEN = process.env.EMAIL_ACCESS_TOKEN || "";
var MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 3000,
    keepAlive: true,
    autoIndex: false,
    retryWrites: false,
};
var MONGO_USERNAME = process.env.MONGO_USERNAME || "vollie-wieit";
var MONGO_PASSWORD = process.env.MONGO_PASSWORD || "RRTJa3wml^SbN1G1o;3S";
var MONGO_HOST = process.env.MONGO_HOST || "wieit.gtchrvd.mongodb.net/test";
var MONGO = {
    host: MONGO_HOST,
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD,
    options: MONGO_OPTIONS,
    url: "mongodb+srv://".concat(MONGO_USERNAME, ":").concat(MONGO_PASSWORD, "@").concat(MONGO_HOST),
};
exports.config = {
    mongo: MONGO,
};
exports.CLOUDINARY_CONFIG = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
};
//# sourceMappingURL=constants.js.map