import { Request, Response } from "express";
import { Logger } from "tslog";
import { handleError } from "../utility";
import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_CONFIG } from "../constants";
import { IBasicQualification, isIBasicQualification } from "./qualifications.interface";
import Qualification from "./qualification.model";
import User from "../User/user.model";
import mongoose, { Types } from "mongoose";
import { getUserByEmail } from "../User/user.controller";
import { IUser } from "../User/user.interface";
import QualificationType from "../QualificationType/qualificationType.model";

cloudinary.config(CLOUDINARY_CONFIG);
const logger = new Logger({ name: "qualifications.controller" });

export const createQualification = async (req: Request, res: Response) => {
    const newQualification = req.body as IBasicQualification;
    if (!isIBasicQualification(newQualification)) {
        res.status(400).json({ message: "New qualification request body not in expected format", success: false });
        return;
    }

    try {
        const qualificationtype = await QualificationType.findOne({
            _id: newQualification?.qualificationType || "",
        });
        if (!newQualification?.qualificationType || !qualificationtype) {
            handleError(logger, res, null, "Qualification type not found.", 404);
            return;
        }
        const user = await (newQualification.user && req.session.user?.isAdmin
            ? User.findById(newQualification.user)
            : getUserByEmail(req.session.user?.email || ""));
        if (!user) {
            res.status(404).json({ message: "User not found", success: false });
            return;
        }

        const uploadResponse = await cloudinary.uploader.upload(newQualification.filePath, {
            upload_preset: "nzdtliy9",
        });

        const qual = new Qualification({
            title: newQualification.title,
            description: newQualification.description,
            filePath: uploadResponse.secure_url,
            fileId: uploadResponse.public_id,
            qualificationType: newQualification?.qualificationType,
            approved: !qualificationtype.requiresApproval, // assume that the qualification is approved if it required no admin approval
            user: user._id,
        });

        qual.id = new mongoose.Types.ObjectId();

        await user.update({ $push: { qualifications: qual._id as string } });
        await Promise.all([qual.save(), user.save()]);

        res.status(200).json({ message: "Created qualification successfully", success: true });
    } catch (err) {
        handleError(logger, res, err, "An unexpected error occured while creating qualification.");
        return;
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

        // find all the qualifications and populate the qualification type nested doc instead of sending back an id
        const qualifications = await Qualification.find({ _id: { $in: currentUser.qualifications } }).populate(
            "qualificationType"
        );

        res.status(200).json({
            message: "Got qualifications for current user successfully",
            data: qualifications,
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
                message: "Could not find matching qualification",
                success: false,
            });
            return;
        }

        qualification.title = qualificationFields.title;
        qualification.description = qualificationFields.description;

        await qualification.save();

        res.status(200).json({
            message: "Updated qualification",
            data: qualification,
            success: true,
        });
    } catch (err) {
        handleError(logger, res, err, "Update qualification failed");
    }
};

export const deleteQualificationById = async (req: Request, res: Response) => {
    try {
        const qual = await Qualification.findById(req.params.id).populate("qualificationType");

        if (!qual) {
            res.status(404).json({
                message: "Could not find matching qualification",
                success: false,
            });
            return;
        }

        console.log(qual);

        const pullIDResponse = await User.updateOne(
            { _id: qual.user.toString() },
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            { $pull: { qualifications: qual._id } }
        );
        console.log(pullIDResponse);
        await cloudinary.uploader.destroy(qual.fileId);
        await qual.remove();

        res.status(200).json({
            message: "Deleted qualification",
            data: null,
            success: true,
        });
    } catch (err) {
        handleError(logger, res, err, "Delete qualification failed");
    }
};

export const setApprovalQualificationForUser = async (req: Request, res: Response) => {
    try {
        // Get user obj to check if admin
        const userObj = await User.findOne({ _id: req.session.user?._id });

        if (!userObj || !userObj?.isAdmin) {
            handleError(logger, res, null, "Unauthorized", 401);
            return;
        }

        // Ensure this user has this qualification in the first place (redundant check but ensures that consumers of API provide a corresponding qualID and userID)
        const qualification = await Qualification.findById(req.params.qualificationID);
        if (!req.params.qualificationID || !qualification) {
            handleError(logger, res, null, "Qualification not found.", 404);
            return;
        }

        const targetUser = await User.findOne({ _id: req.params.userID });
        if (!req.params.userID || !targetUser) {
            handleError(logger, res, null, "User not found.", 404);
            return;
        }

        const userHasQual = targetUser.qualifications.includes(qualification._id as Types.ObjectId);
        if (!userHasQual) {
            handleError(logger, res, null, "User does not have this qualification.", 404);
            return;
        }

        const updateResult = await Qualification.updateOne(
            { _id: qualification._id as string },
            { approved: req.params.status === "approve" }
        );

        res.status(200).json({
            message: "Successfully approved qualification",
            data: updateResult,
            success: true,
        });
    } catch (err) {
        handleError(logger, res, err, "Update qualification failed");
    }
};
