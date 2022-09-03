import { Request, Response } from "express";
import { Logger } from "tslog";
import { handleError } from "../utility";
import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_CONFIG } from "../constants";
import { isIBasicQualification, mapQualificationToQualificationSummary } from "./qualifications.interface";
import Qualification from "./qualification.model";
import User from "../User/user.model";
import mongoose from "mongoose";
import { getUserByEmail } from "../User/user.controller";
import { IUser } from "../User/user.interface";

cloudinary.config(CLOUDINARY_CONFIG);
const logger = new Logger({ name: "qualifications.controller" });

export const createQualification = async (req: Request, res: Response) => {
    const newQualification = req.body as unknown;
    if (!isIBasicQualification(newQualification)) {
        res.status(400).json({ message: "New qualification request body not in expected format", success: false });
        return;
    }

    try {
        const user = await (newQualification.user && req.session.user?.isAdmin
            ? User.findById(newQualification.user)
            : getUserByEmail(req.session.user?.email || ""));
        if (!user) {
            res.status(404).json({ message: "User not found", success: false });
            return;
        }

        const uploadResponse = await cloudinary.uploader.upload(newQualification.filePath, {
            upload_preset: "ml_default",
        });

        const qual = new Qualification({
            title: newQualification.title,
            description: newQualification.description,
            filePath: uploadResponse.secure_url,
            fileId: uploadResponse.public_id,
        });

        qual.id = new mongoose.Types.ObjectId();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        await user.update({ $push: { qualifications: qual._id } });
        await Promise.all([qual.save(), user.save()]);

        res.status(200).json({ message: "Created qualification successfully", success: true });
    } catch (err) {
        handleError(logger, res, err, "An unexpected error occured");
    }
};

export const getQualificationsForUserId = async (req: Request, res: Response) => {
    await getQualificationsForUser(User.findById(req.params.id).exec(), res);
};

export const getOwnQualifications = async (req: Request, res: Response) => {
    await getQualificationsForUser(getUserByEmail(req.session.user?.email || ""), res);
};

const getQualificationsForUser = async (userPromise: Promise<IUser | undefined | null>, res: Response) => {
    try {
        const currentUser = await userPromise;
        if (!currentUser) {
            res.status(404).json({ message: "Could not find user", success: false });
            return;
        }
        const qualifications = await Qualification.find({ _id: { $in: currentUser.qualifications } });
        res.status(200).json({
            message: "Got qualifications for current user successfully",
            data: qualifications.map(mapQualificationToQualificationSummary),
            success: true,
        });
    } catch (err) {
        handleError(logger, res, err, "An unexpected error occured");
    }
};

export const updateQualificationById = async (req: Request, res: Response) => {
    try {
        const qualificationFields = req.body as unknown;
        if (!isIBasicQualification(qualificationFields)) {
            res.status(400).json({ message: "Update qualification request body was not valid", success: false });
            return;
        }

        const qualification = await Qualification.findById(req.params.id);

        if (!qualification) {
            res.status(404).json({
                message: "Could not find matching tag",
                success: false,
            });
            return;
        }

        qualification.title = qualificationFields.title;
        qualification.description = qualificationFields.description;

        await qualification.save();

        res.status(200).json({
            message: "Updated qualification",
            data: mapQualificationToQualificationSummary(qualification),
            success: true,
        });
    } catch (err) {
        handleError(logger, res, err, "Update qualification failed");
    }
};

export const deleteQualificationById = async (req: Request, res: Response) => {
    try {
        const qual = await Qualification.findById(req.params.id);

        if (!qual) {
            res.status(404).json({
                message: "Could not find matching qualification",
                success: false,
            });
            return;
        }

        await cloudinary.uploader.destroy(qual.fileId);
        await qual.remove();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        await User.updateOne({ _id: qual.user }, { $pull: { qualifications: qual.id } });

        res.status(200).json({
            message: "Deleted qualification",
            data: mapQualificationToQualificationSummary(qual),
            success: true,
        });
    } catch (err) {
        handleError(logger, res, err, "Delete qualification failed");
    }
};
