import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { createImage, updateImage, NewImage } from "../api/profileAPI";

const allowedFileTypes = [".jpg", ".jpeg", ".svg", ".png"];
const acceptParam = allowedFileTypes.join(", ");
interface CreateOrEditImageProps {
    image: NewImage;
    onClose: (success?: boolean) => void;
    isNew?: boolean;
}

// interface ModalState extends Qualification {
//     file?: File;
//     fileName: string;
//     errorMessage?: string;
//     uploading?: boolean;
// }

export const CreateOrEditImageModal = (props: CreateOrEditImageProps) => {
    const [fileName, setFileName] = useState("");

    const [file, setFile] = useState<File | null>(null);

    const [uploading, setUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const fileName = e.target.value;
        const fileParts = fileName.split(".");
        const extension = "." + (fileParts[fileParts.length - 1] || "");
        if (allowedFileTypes.includes(extension.toLowerCase())) {
            setFile(file);
            setFileName(fileName);
        } else {
            setErrorMessage("Please upload only images");
        }
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!props.isNew) {
            void uploadImage("");
            return;
        }

        if (!file) return;
        const reader = new FileReader();
        setUploading(true);
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            if (typeof reader.result === "string") {
                void uploadImage(reader.result);
            } else {
                console.error("File input could not be handled!");
                setUploading(false);
            }
        };
        reader.onerror = () => {
            console.error("An error occurred trying to read the file.");
            setUploading(false);
        };
    };

    const uploadImage = async (base64EncodedImage: string) => {
        let errorMessage = "";
        try {
            const { isNew, image } = props;
            const response = await (isNew
                ? createImage(base64EncodedImage, image.user)
                : updateImage({
                      _id: image._id,
                      user: image.user,
                  }));
            if (!response.success) {
                errorMessage = response.message;
                return;
            }
            if (props.onClose) props.onClose(true);
        } catch (err) {
            console.error(err);
            errorMessage = "An unexpected error occurred.";
        } finally {
            setErrorMessage(errorMessage);
            setUploading(false);
        }
    };

    // const { title, description, fileName, file, errorMessage, uploading } = this.state;
    const { isNew, onClose } = props || {};
    const disabled = (isNew && !(fileName && file)) || uploading;
    return (
        <Modal show={true} onHide={onClose} backdrop="static">
            <Modal.Header closeButton={!uploading}>
                <Modal.Title>{"Edit"} profile image</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {isNew && (
                        <Form.Group controlId="qFile" className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                accept={acceptParam}
                                type="file"
                                name="qImage"
                                onChange={onChangeFile}
                                value={fileName}
                            />
                        </Form.Group>
                    )}
                </Form>
                {errorMessage && <p>{errorMessage}</p>}
                {uploading && <p>Saving...</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => onClose()} disabled={uploading}>
                    Cancel
                </Button>
                <Button variant={isNew ? "success" : "primary"} onClick={(e) => onSubmit(e)} disabled={disabled}>
                    {isNew ? "Upload" : "Save"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
