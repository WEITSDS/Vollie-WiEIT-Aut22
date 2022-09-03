import { OTPEntry, OTPQuery } from "./otp.model";

class OTPManager {
    private otpStore = new Map<string, OTPEntry>();

    private static OTP_DURATION = 60 * 60 * 1000;

    constructor() {
        const msInAQuarterDay = 0.25 * 24 * 60 * 60 * 1000;
        setInterval(this.clearOldOTPs, msInAQuarterDay);
    }

    private static generateOTP(numDigits = 6): string {
        return Math.random().toFixed(numDigits).substring(2);
    }

    private static hasOTPExpired(entry: OTPEntry): boolean {
        return entry.timeGenerated + OTPManager.OTP_DURATION < Date.now();
    }

    createOTPForUser(email: string): string {
        const code = OTPManager.generateOTP();
        this.otpStore.set(email, { code, timeGenerated: Date.now() });
        return code;
    }

    isOTPValid({ email, code }: OTPQuery): boolean {
        const entry = this.otpStore.get(email);
        return entry != null && !OTPManager.hasOTPExpired(entry) && entry.code === code;
    }

    removeOTPForUser(email: string): boolean {
        // TODO maybe log if it was deleted but .delete() did not return true
        return this.otpStore.delete(email);
    }

    clearOldOTPs = (): void => {
        for (const [email, entry] of [...this.otpStore]) {
            if (OTPManager.hasOTPExpired(entry)) {
                this.otpStore.delete(email);
            }
        }
    };
}

const otpManager = new OTPManager();

// NOTE: only need to expose the functions below and not everything in OTPManager

/** Generates an OTP for the given user, valid for an hour */
export function generateOTPForUser(email: string): string {
    return otpManager.createOTPForUser(email);
}

/** Checks if provided OTP is valid for the email and removes it immediately */
export function checkIfOTPValidAndRemove(query: OTPQuery): boolean {
    if (otpManager.isOTPValid(query)) {
        otpManager.removeOTPForUser(query.email);
        return true;
    }
    return false;
}
