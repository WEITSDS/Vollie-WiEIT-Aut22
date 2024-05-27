import * as nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import { Logger } from "tslog";
import { EMAIL_USER, SITE_NAME, HOST, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USERNAME } from "../constants";
import { generateOTPForUser } from "../otps/otpManager";
import User from "../User/user.model";
import { createNotification } from "../Notifications/notifications.controller";

const logger = new Logger({ name: "mailer" });

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    requireTLS: true,
    auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD,
    },
});

export async function sendOTPEmail(userFirstName: string, userEmail: string): Promise<void> {
    const userOTP = generateOTPForUser(userEmail);
    logger.debug(`OTP for '${userEmail}': ${userOTP}`);
    const content = `Hey ${userFirstName},\n\nHere's the one time password you requested:\n${userOTP}`;
    return await sendEmail(`Your ${SITE_NAME} One Time Password`, content, userEmail);
}
export async function sendSignedUpShiftEmail(
    userFirstName: string,
    userEmail: string,
    shiftName: string,
    shiftLocation: string,
    shiftStartTime: Date,
    shiftEndTime: Date,
    typeId: string,
    userVolType: string
): Promise<void> {
    logger.debug(`Sending shift signup email for '${userEmail}' for shift ''${shiftName}`);
    const content =
        `Hey ${userFirstName},\n\n` +
        `You've signed up for the shift '${shiftName}' at ${shiftLocation} from ${shiftStartTime} to ${shiftEndTime}. See you there!`;
    const ccEmails = await getAdminEmails();
    const type = "Approve Shift";
    console.log("hi chekcing sendSignedUp mailer: " + userVolType);
    await createNotification(userEmail, content, userFirstName, ccEmails, type, typeId, userVolType);
    return await sendEmail(`Your ${SITE_NAME} Shift Details`, content, userEmail, ccEmails);
}
export async function sendCancelledShiftEmail(
    userFirstName: string,
    userEmail: string,
    shiftName: string,
    shiftLocation: string,
    shiftStartTime: Date
): Promise<void> {
    logger.debug(`Sending shift cancelled email for '${userEmail}' for shift ''${shiftName}`);
    const content = `Hey ${userFirstName},\n\nYour shift '${shiftName}' at ${shiftStartTime} at ${shiftLocation} was cancelled.`;
    const ccEmails = await getAdminEmails();
    const type = "Cancelled Shift";
    await createNotification(userEmail, content, userFirstName, ccEmails, type);
    return await sendEmail(`Your ${SITE_NAME} Shift Has Been Cancelled`, content, userEmail, ccEmails);
}

export async function sendUpdateShiftEmail(
    userFirstName: string,
    userEmail: string,
    shiftName: string,
    shiftLocation: string,
    shiftStartTime: Date,
    shiftEndTime: Date
): Promise<void> {
    logger.debug(`Sending shift update email email for '${userEmail}' for shift ''${shiftName}`);
    const content =
        `Hey ${userFirstName},\n\n` +
        `Your shift has been updated '${shiftName}' at ${shiftLocation} from ${shiftStartTime} to ${shiftEndTime}. See you there!`;
    const ccEmails = await getAdminEmails();
    const type = "Updated Shift";
    await createNotification(userEmail, content, userFirstName, ccEmails, type);
    return await sendEmail(`Your ${SITE_NAME} Shift Has Been Updated`, content, userEmail, ccEmails);
}

export async function sendVolunteerRequestEmail(
    email: string | string[],
    userID: string,
    userFirstName: string,
    userLastName: string,
    volunteerType: string,
    typeId: string,
    userVolType: string
): Promise<void> {
    logger.debug(`
        Sending volunteer type approval email to admin email '${email.toString()}' for user ${userFirstName} ${userLastName}
    `);
    const content = `Dear ${SITE_NAME} woah administrator,\n\n${userFirstName} ${userLastName} is requesting approval for volunteer type "${volunteerType}".\n
    If you approve of this change, head to their page (${HOST}/profile/${userID}) and click ${typeId} "Approve".`;
    const type = typeId;
    const adminCCs: string[] = [];
    const isArray = Array.isArray(email);
    // if there is more than one administrator
    if (isArray && email.length > 1) {
        // notification doesn't support multiple emails so copying every email after the first into a new array to be used for CCs
        for (let i = 1; i < email.length; i++) {
            adminCCs[i - 1] = email[i];
        }
        await createNotification(email[0], content, userFirstName, adminCCs, volunteerType, typeId, userVolType);
    } else if (!isArray) await createNotification(email, content, userFirstName, adminCCs, type, typeId, userVolType);
    return await sendEmail(`${SITE_NAME} - User Requesting Volunteer Type Approval`, content, email);
}

export async function sendVolunteerApprovalEmail(
    userEmail: string,
    userFirstName: string,
    userLastName: string,
    volunteerType: string
): Promise<void> {
    logger.debug(`
        Sending volunteer type approval email to admin email '${userEmail.toString()}' for user ${userFirstName} ${userLastName}
    `);
    const content = `Hey ${userFirstName},\n\nYour request for volunteer type '${volunteerType}' was approved. Congratulations!`;
    const type = "Volunteer Type Request Approved";
    const ccEmails = await getAdminEmails();
    await createNotification(userEmail, content, userFirstName, ccEmails, type);
    return await sendEmail(`Your ${SITE_NAME} Volunteer Type Request was Approved`, content, userEmail, ccEmails);
}

export async function sendQualificationExpiryEmail(
    userFirstName: string,
    userLastName: string,
    userId: string,
    email: string | string[]
    // qualTitle: string
): Promise<void> {
    logger.debug(
        //`Sending qualification expiry email for ${userFirstName} ${userLastName} for expired qualification '${qualTitle}'`
        `Sending qualification expiry email for ${userFirstName} ${userLastName}`
    );
    // const content = `Dear ${SITE_NAME} administrator,\n\nThis email is to let you know that a qualification (${qualTitle})
    const content = `Dear ${SITE_NAME} administrator,\n\nThis email is to let you know that a qualification
    of user ${userFirstName} ${userLastName} expires today.\n You can visit their page (${HOST}/profile/${userId}) to revoke 
    approval for this qualification.\n`;
    const type = "Expired Qualification";
    const adminCCs: string[] = [];
    const isArray = Array.isArray(email);
    // if there is more than one administrator
    if (isArray && email.length > 1) {
        // notification doesn't support multiple emails so copying every email after the first into a new array to be used for CCs
        for (let i = 1; i < email.length; i++) {
            adminCCs[i - 1] = email[i];
        }
        await createNotification(email[0], content, userFirstName, adminCCs, type);
    } else if (!isArray) await createNotification(email, content, userFirstName, adminCCs, type);
    return await sendEmail(`${SITE_NAME} - Volunteer qualification expiry notification`, content, email);
}

export async function sendQualificationApprovalEmail(
    userFirstName: string,
    userLastName: string,
    userEmail: string,
    qualTitle: string
): Promise<void> {
    logger.debug(
        `Sending qualification approval email for ${userFirstName} ${userLastName} for approved qualification '${qualTitle}'`
    );
    const content = `Hey ${userFirstName},\n\nYour qualification (${qualTitle}) on ${SITE_NAME} was approved.\n`;
    const ccEmails = await getAdminEmails();
    const type = "Qualification Approved";
    await createNotification(userEmail, content, userFirstName, ccEmails, type);
    return await sendEmail(`${SITE_NAME} - Volunteer qualification expiry notification`, content, userEmail, ccEmails);
}

/** Send an email with the provided parameters.
 * @param subject The subject / title of the email
 * @param content The content / body of the email (can be pure string or HTML as string)
 * @param toEmail Can be a single address (string) or multiple (string array)
 * @param ccEmail Can be a single address (string) or multiple (string array)
 * @param isHTML If the content variable is meant to be treated as HTML or not */
async function sendEmail(
    subject: string,
    content: string,
    toEmail: string | string[],
    ccEmail: string | string[] = "",
    isHTML = false
): Promise<void> {
    // check if the addresses are just string (which means they're a single address)
    // else, do a join on the string array to make into a string :)
    const toEmails = typeof toEmail === "string" ? toEmail : toEmail.join(", ");
    const ccEmails = typeof ccEmail === "string" ? ccEmail : ccEmail.join(", ");
    const options: MailOptions = {
        from: EMAIL_USER,
        to: toEmails,
        cc: ccEmails,
        subject,
        // Only set either text or html, but not both
        text: !isHTML ? content : undefined,
        html: isHTML ? content : undefined,
    };

    try {
        await transporter.sendMail(options);
    } catch (error: unknown) {
        logger.error(error);
    }
}

async function getAdminEmails(): Promise<string | string[]> {
    const adminEmail = await User.find({ isAdmin: true }).exec();
    const emails = [];
    for (let i = 0; i < adminEmail.length; i++) {
        emails.push(adminEmail[i].email);
    }
    return emails;
}
