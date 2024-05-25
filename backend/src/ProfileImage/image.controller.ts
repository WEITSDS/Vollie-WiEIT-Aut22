import { Request, Response } from "express";
import { Logger } from "tslog";
import { handleError } from "../utility";
import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_CONFIG } from "../constants";
import { IBasicImage, isIBasicImage } from "./image.interface";
import Image from "./image.model";
import User from "../User/user.model";
import mongoose from "mongoose";
import { getUserByEmail } from "../User/user.controller";
import { IUser } from "../User/user.interface";

cloudinary.config(CLOUDINARY_CONFIG);
const logger = new Logger({ name: "image.controller" });

export const getValidImages = () => {
    try {
        const images = Image.find({ expiredAndNotified: false });
        return images;
    } catch (err: unknown) {
        logger.error(err);
        return undefined;
    }
};

export const createProfileImage = async (req: Request, res: Response) => {
    const newImage = req.body as IBasicImage;
    if (!isIBasicImage(newImage)) {
        res.status(400).json({ message: "New image request body not in expected format", success: false });
        return;
    }

    try {
        const user = await (newImage.user && req.session.user?.isAdmin
            ? User.findById(newImage.user)
            : getUserByEmail(req.session.user?.email || ""));
        if (!user) {
            res.status(404).json({ message: "User not found", success: false });
            return;
        }

        const uploadResponse = await cloudinary.uploader.upload(newImage.filePath, {
            upload_preset: "nzdtliy9",
        });

        const profImage = new Image({
            filePath: uploadResponse.secure_url,
            fileId: uploadResponse.public_id,
            user: user._id,
        });

        profImage.id = new mongoose.Types.ObjectId();

        await user.update({ $push: { qualifications: profImage._id as string } });
        await Promise.all([profImage.save(), user.save()]);

        res.status(200).json({ message: "Created image successfully", success: true });
    } catch (err) {
        handleError(logger, res, err, "An unexpected error occured while creating image.");
        return;
    }
};

export const getImagesForUserId = async (req: Request, res: Response) => {
    await getImagesForUser(User.findById(req.params.id).exec(), res);
};

export const getOwnImages = async (req: Request, res: Response) => {
    await getImagesForUser(getUserByEmail(req.session.user?.email || ""), res);
};

const getImagesForUser = async (userPromise: Promise<IUser | undefined | null>, res: Response) => {
    try {
        const currentUser = await userPromise;
        if (!currentUser) {
            res.status(404).json({ message: "Could not find user", success: false });
            return;
        }

        // find all the qualifications and populate the qualification type nested doc instead of sending back an id
        // const images = await Image.find({ _id: { $in: currentUser.qualifications } }).populate();

        //res.status(200).json({
        //message: "Got qualifications for current user successfully",
        //data: images,
        //success: true,
        //});
    } catch (err) {
        handleError(logger, res, err, "An unexpected error occured");
    }
};

export const updateImageById = async (req: Request, res: Response) => {
    try {
        const fileFields = req.body as unknown;
        if (!isIBasicImage(fileFields)) {
            res.status(400).json({ message: "Update image request body was not valid", success: false });
            return;
        }

        const profileimage = await Image.findById(req.params.id);

        if (!profileimage) {
            res.status(404).json({
                message: "Could not find matching image",
                success: false,
            });
            return;
        }

        await profileimage.save();

        res.status(200).json({
            message: "Updated qualification",
            data: profileimage,
            success: true,
        });
    } catch (err) {
        handleError(logger, res, err, "Update qualification failed");
    }
};
