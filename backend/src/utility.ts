import { Logger } from "tslog";
import { NextFunction, Response, Request } from "express";

export function handleError(loggerObj: Logger, res: Response, err: unknown, message: string, status = 500): Response {
    loggerObj.error(err);
    return res.status(status).json({
        message,
        err,
        success: false,
    });
}

export function wrapAsync(
    fn: (r1: Request, r2: Response) => Promise<void>
): (r1: Request, r2: Response, n: NextFunction) => void {
    return (req, res, next) => {
        const fnReturn = fn(req, res);
        Promise.resolve(fnReturn).catch(next);
    };
}
