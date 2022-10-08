import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Qualification, createQualification, updateQualification } from "../../api/qualificationAPI";

const allowedFileTypes = [".jpg", ".jpeg", ".svg", ".png"];
const acceptParam = allowedFileTypes.join(", ");
interface CreateOrEditQualificationProps {
    qualification: Qualification;
    onClose: (success?: boolean) => void;
    isNew?: boolean;
}

interface ModalState extends Qualification {
    file?: File;
    fileName: string;
    errorMessage?: string;
    uploading?: boolean;
}
export class CreateOrEditQualificationModal extends React.Component<CreateOrEditQualificationProps, ModalState> {
    constructor(props: CreateOrEditQualificationProps) {
        super(props);
        this.state = { ...props.qualification, fileName: "" };
    }

    onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ title: e.target.value });
    };

    onChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ description: e.target.value });
    };

    onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const fileName = e.target.value;
        const fileParts = fileName.split(".");
        const extension = "." + (fileParts[fileParts.length - 1] || "");
        if (allowedFileTypes.includes(extension.toLowerCase())) {
            this.setState({ file, fileName });
        } else {
            this.setState({ errorMessage: "Please upload only images" });
        }
    };

    onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!this.props.isNew) {
            void this.uploadImage("");
            return;
        }

        const file = this.state.file;
        if (!file) return;
        const reader = new FileReader();
        this.setState({ uploading: true });
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            if (typeof reader.result === "string") {
                void this.uploadImage(reader.result);
            } else {
                console.error("File input could not be handled!");
                this.setState({ uploading: false });
            }
        };
        reader.onerror = () => {
            console.error("An error occurred trying to read the file.");
            this.setState({ uploading: false });
        };
    };

    uploadImage = async (base64EncodedImage: string) => {
        let errorMessage = "";
        try {
            const { isNew, qualification } = this.props;
            const { title, description, _id } = this.state;
            const response = await (isNew
                ? createQualification(title, description, base64EncodedImage, qualification.user)
                : updateQualification({ _id, title, description, user: qualification.user }));
            if (!response.success) {
                errorMessage = response.message;
                return;
            }
            this.props.onClose(true);
        } catch (err) {
            console.error(err);
            errorMessage = "An unexpected error occurred.";
        } finally {
            this.setState({ errorMessage, uploading: false });
        }
    };

    render() {
        const { title, description, fileName, file, errorMessage, uploading } = this.state;
        const { isNew, onClose } = this.props;
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
                            <Form.Control
                                type="text"
                                name="qName"
                                value={title}
                                onChange={this.onChangeTitle}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="qDesc" className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                type="text"
                                name="qDesc"
                                value={description}
                                onChange={this.onChangeDescription}
                            />
                        </Form.Group>
                        <Form.Group controlId="qType" className="mb-3">
                            <Form.Label>Qualification Type</Form.Label>
                            <Form.Select
                                //onChange={handleChange}
                                aria-label="Shift category"
                                defaultValue="Select Qualification Type"
                            >
                                <option value="Other">Other</option>
                                <option value="WWC">Working With Children</option>
                                <option value="First Aid">First Aid</option>
                                <option value="Committee">Committee</option>
                            </Form.Select>
                        </Form.Group>
                        {isNew && (
                            <Form.Group controlId="qFile" className="mb-3">
                                <Form.Label>Qualification Image</Form.Label>
                                <Form.Control
                                    accept={acceptParam}
                                    type="file"
                                    name="qImage"
                                    onChange={this.onChangeFile}
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
                    <Button variant={isNew ? "success" : "primary"} onClick={this.onSubmit} disabled={disabled}>
                        {isNew ? "Upload" : "Save"}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

interface ConfirmDeleteModalProps {
    qualification: Qualification;
    onClose: (id?: string) => void;
}
export const ConfirmDeleteModal = ({ qualification, onClose }: ConfirmDeleteModalProps): JSX.Element => {
    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Tag</Modal.Title>
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
