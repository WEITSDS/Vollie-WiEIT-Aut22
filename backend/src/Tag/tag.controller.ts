import { NextFunction, Request, Response } from "express";
import Tag from "./tag.model";
import User from "../User/user.model";
import mongoose from "mongoose";
import { Logger } from "tslog";
import { handleError } from "../utility";
import { convertTagToTagSummary, isIBasicTag } from "./tag.interface";

const logger = new Logger({ name: "tag.controller" });

export const getAllTags = (_req: Request, res: Response, _next: NextFunction) => {
    Tag.find()
        .exec()
        .then((results) => {
            return res.status(200).json({
                data: results.map(convertTagToTagSummary),
                success: true,
                message: "Retrieved matching tags",
            });
        })
        .catch((err: unknown) => {
            handleError(logger, res, err, "Get all tags failed");
        });
};

export const getTagById = async (req: Request, res: Response): Promise<void> => {
    try {
        const tag = await Tag.findById(req.params.id);
        if (!tag) {
            res.status(404).json({
                message: "No matching tag",
                success: false,
            });
            return;
        }
        res.status(200).json({
            message: "Found matching tag",
            success: true,
            data: convertTagToTagSummary(tag),
        });
    } catch (err) {
        handleError(logger, res, err, "Get tag failed");
    }
};

export const createTag = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.session.user?.isAdmin) {
            res.status(404).send();
            return;
        }
        const tagFields = req.body as unknown;
        if (!isIBasicTag(tagFields)) {
            res.status(400).json({ message: "New tag request body was not valid", success: false });
            return;
        }

        const newTag = new Tag({
            id: new mongoose.Types.ObjectId(),
            name: tagFields.name,
            description: tagFields.description,
        });

        logger.info(newTag);

        await newTag.save();
        res.status(200).json({
            message: "Tag creation success",
            data: convertTagToTagSummary(newTag),
            success: true,
        });
    } catch (err) {
        handleError(logger, res, err, "Tag creation failed");
    }
};

export const updateTagById = async (req: Request, res: Response) => {
    try {
        if (!req.session.user?.isAdmin) {
            res.status(404).send();
            return;
        }
        const tagFields = req.body as unknown;
        if (!isIBasicTag(tagFields)) {
            res.status(400).json({ message: "Update tag request body was not valid", success: false });
            return;
        }

        const tag = await Tag.findById(req.params.id);

        if (!tag) {
            res.status(404).json({
                message: "Could not find matching tag",
                success: false,
            });
            return;
        }

        tag.name = tagFields.name;
        tag.description = tagFields.description;

        await tag.save();

        res.status(200).json({
            message: "Updated tag",
            data: convertTagToTagSummary(tag),
            success: true,
        });
    } catch (err) {
        handleError(logger, res, err, "Update tag failed");
    }
};

export const deleteTagById = async (req: Request, res: Response) => {
    try {
        if (!req.session.user?.isAdmin) {
            res.status(404).send();
            return;
        }
        const tag = await Tag.findById(req.params.id);

        if (!tag) {
            res.status(404).json({
                message: "Could not find matching tag",
                success: false,
            });
            return;
        }

        await tag.remove();

        // Have to disable rule for the line, see link below for why
        // https://github.com/Automattic/mongoose/issues/10075#issuecomment-818269749
        // TODO for dev from the future: fix pls :(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        await User.updateMany({ _id: tag.users }, { $pull: { tags: tag._id } });

        res.status(200).json({
            message: "Deleted tag",
            data: convertTagToTagSummary(tag),
            success: true,
        });
    } catch (err) {
        handleError(logger, res, err, "Delete tag failed");
    }
};
