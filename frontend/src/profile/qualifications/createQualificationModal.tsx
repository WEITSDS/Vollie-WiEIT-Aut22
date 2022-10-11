import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Qualification, createQualification, updateQualification } from "../../api/qualificationAPI";
import { useAllQualTypes } from "../../hooks/useAllQualTypes";

const allowedFileTypes = [".jpg", ".jpeg", ".svg", ".png"];
const acceptParam = allowedFileTypes.join(", ");
interface CreateOrEditQualificationProps {
    qualification: Qualification;
    onClose: (success?: boolean) => void;
    isNew?: boolean;
}

// interface ModalState extends Qualification {
//     file?: File;
//     fileName: string;
//     errorMessage?: string;
//     uploading?: boolean;
// }

export const CreateOrEditQualificationModal = (props: CreateOrEditQualificationProps) => {
    const [fileName, setFileName] = useState("");

    const { data: qualTypesData } = useAllQualTypes();
    const allQualTypes = qualTypesData?.data;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [selectedQualType, setSelectedQualType] = useState<string>("");

    const [uploading, setUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const onChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };

    const handleQualTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value);
        setSelectedQualType(e.target.value);
    };

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
            const { isNew, qualification } = props;
            const response = await (isNew
                ? createQualification(title, description, base64EncodedImage, selectedQualType, qualification.user)
                : updateQualification({
                      _id: qualification._id,
                      title,
                      description,
                      selectedQualType,
                      user: qualification.user,
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
    const disabled = (isNew && !(title && fileName && file)) || !(title && description) || uploading;
    return (
        <Modal show={true} onHide={onClose} backdrop="static">
            <Modal.Header closeButton={!uploading}>
                <Modal.Title>{isNew ? "New" : "Edit"} Qualification</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="qName" className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" name="qName" value={title} onChange={onChangeTitle} required />
                    </Form.Group>
                    <Form.Group controlId="qDesc" className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            type="text"
                            name="qDesc"
                            value={description}
                            onChange={onChangeDescription}
                        />
                    </Form.Group>
                    <Form.Group controlId="qType" className="mb-3">
                        <Form.Label>Qualification Type</Form.Label>
                        <Form.Select
                            onChange={handleQualTypeChange}
                            aria-label="Shift category"
                            defaultValue="Select Qualification Type"
                        >
                            {allQualTypes?.map((qual) => {
                                return (
                                    <option key={qual._id} value={qual._id}>
                                        {qual.name}
                                    </option>
                                );
                            })}
                        </Form.Select>
                    </Form.Group>
                    {isNew && (
                        <Form.Group controlId="qFile" className="mb-3">
                            <Form.Label>Qualification Image</Form.Label>
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
interface ConfirmDeleteModalProps {
    qualification: Qualification;
    onClose: (id?: string) => void;
}
export const ConfirmDeleteModal = ({ qualification, onClose }: ConfirmDeleteModalProps): JSX.Element => {
    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Qualification</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete the qualification '{qualification.title}'? This action cannot be undone.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => onClose()}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={() => onClose(qualification._id)}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
