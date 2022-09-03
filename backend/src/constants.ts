import dotenv from "dotenv";
dotenv.config();
// ^ sets it up so the env can actually be read

export const SITE_NAME = "Vollie";

// Server config constants
export const PORT: number = +(process.env.PORT || 0) || 4000;
export const HOST: string = process.env.HOST || "localhost";
export const PROTOCOL: string = process.env.PROTOCOL || "http";

/** Where the login page is located on the front end, so that we can redirect the user there if needed */
export const LOGIN_URL: string = process.env.LOGIN_URL || `${PROTOCOL}://${HOST}/login`;

// Cookie stuff
export const COOKIE_SECRET: string = process.env.COOKIE_SECRET || "d2y3hjaksd09apok23465r";
/** How long sessions last in milliseconds, configured as number of hours in a .env */
export const COOKIE_DURATION: number = 1000 * 60 * 60 * (+(process.env.COOKIE_DURATION || 0) || 24);

// Emailer stuff
export const EMAIL_USER: string = process.env.EMAIL_USER || "";
export const EMAIL_CLIENT_ID: string = process.env.EMAIL_CLIENT_ID || "";
export const EMAIL_CLIENT_SECRET: string = process.env.EMAIL_CLIENT_SECRET || "";
export const EMAIL_REFRESH_TOKEN: string = process.env.EMAIL_REFRESH_TOKEN || "";
export const EMAIL_ACCESS_TOKEN: string = process.env.EMAIL_ACCESS_TOKEN || "";

// API keys
// idk we dont have any :(

// Database stuff
const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 3000,
    keepAlive: true,
    autoIndex: false,
    retryWrites: false,
};

const MONGO_USERNAME = process.env.MONGO_USERNAME || "weit_user";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "IdCRhTHXp3sUBu8M";
const MONGO_HOST = process.env.MONGO_HOST || "cluster0.cfutj.mongodb.net/WEIT";

const MONGO = {
    host: MONGO_HOST,
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD,
    options: MONGO_OPTIONS,
    url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`,
};

export const config = {
    mongo: MONGO,
};

// // Cloudinary stuff
export const CLOUDINARY_CONFIG = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
};
