import express, { RequestHandler } from "express";
import { PORT, HOST, PROTOCOL } from "./constants";
import mongoose from "mongoose";
import userRoutes from "./User/user.route";
import userAdminRoutes from "./User/user.admin.route";
import shiftRoutes from "./Shift/shift.route";
import qualificationRoutes from "./Qualifications/qualifications.route";
import qualificationTypeRoutes from "./QualificationType/qualificationType.route";
import notificationTypeRoutes from "./Notifications/notifications.route";
import volunteerTypeRoutes from "./VolunteerType/volunteerType.route";
// import https = require("https");

// Middleware
import cors from "cors";
import otpRouter from "./otps/otp.route";
import * as sessionManager from "./Common/middleware/sessionManagement";
import { config } from "./constants";
import { Logger } from "tslog";
import { handleLogin, isSignedIn } from "./User/user.controller";
import { wrapAsync } from "./utility";

const logger = new Logger({ name: "index" });
const app = express();

// Start the Express server
app.listen(PORT);
logger.info(`Server started at ${PROTOCOL}://${HOST}:${PORT}`);

/** Connect to Mongo -> mongodb+srv://weit_user:IdCRhTHXp3sUBu8M@cluster0.cfutj.mongodb.net/WEIT */
//http://localhost/vollie

mongoose
    .connect("mongodb+srv://vollie-wieit:uIR1zLv3XQ5o8Ke9@wieit.gtchrvd.mongodb.net/test", config.mongo.options)
    .then((_result) => {
        logger.info(`Connected to MongoDB`);
    })
    .catch((err: unknown) => {
        logger.error("An error occurred trying to connect to MongoDB", err);
    });

// Disable annoying browser security
// TODO: Remove this if not needed
app.use(cors({ origin: `${PROTOCOL}://${HOST}:${PORT}` }));

// Use JSON Parsing Middleware (some issue with typing hence the as cast)
app.use(express.json({ limit: "10mb" }) as RequestHandler);

sessionManager.useSessionManagement(app);

app.use("/api/otp", otpRouter);

//** Session Routes */
//TODO: move the login and logout code into another file
app.post("/api/login", wrapAsync(handleLogin));

app.get("/api/issignedin", wrapAsync(isSignedIn));

app.post("/api/logout", (req, res) => {
    sessionManager.endSession(req, res);
});

//**Use Routes */
app.use("/api/users", userRoutes);
app.use("/api/users/admin", userAdminRoutes);

//**Shift Routes */
app.use("/api/shifts", shiftRoutes);

// Qualification Type Routes
app.use("/api/qualification-types", qualificationTypeRoutes);

// Volunteer Type Routes
app.use("/api/volunteer-types", volunteerTypeRoutes);

// Volunteer Type Routes
app.use("/api/notifications", notificationTypeRoutes);

//Sling API Call to retrieve Auth Token
// app.get("/api/credentials/:email/:password", (request, response) => {
//     const email = request.params.email;
//     const password = request.params.password;

//     const data = JSON.stringify({
//         email: email,
//         password: password,
//         snsToken: "",
//         snsPlatform: "",
//     });

//     const options = {
//         hostname: "api.sling.is",
//         port: 443,
//         path: "/v1/account/login",
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Content-Length": data.length,
//         },
//     };

//     const req = https.request(options, (res) => {
//         response.json(res.headers.authorization);
//     });

//     req.on("error", (error) => {
//         console.error(error);
//     });

//     req.write(data);
//     req.end();
// });
//Sling API Call to retrieve shift data
// app.get("/api/shifts/:token", (request, response) => {
//     const token = request.params.token;
//     let body = "";

//     const options = {
//         hostname: "api.sling.is",
//         port: 443,
//         path: "/v1/shifts/available?pagesize=20",
//         method: "GET",
//         credentials: "omit",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: token,
//         },
//     };

//     const req = https.request(options, (res) => {
//         res.on("data", (d) => {
//             response.json((body += d));
//         });
//     });

//     req.on("error", (error) => {
//         console.error(error);
//     });

//     req.end();
// });
/** Qualification Routes */
app.use("/api/qualifications", qualificationRoutes);
