import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Tag } from "../../api/tagApi";

interface CreateOrEditTagModalProps {
    tag: Tag;
    show: boolean;
    onClose: (tag?: Tag) => void;
    isNew?: boolean;
}

export class CreateOrEditTagModal extends React.Component<CreateOrEditTagModalProps, Tag> {
    constructor(props: CreateOrEditTagModalProps) {
        super(props);
        this.state = { ...props.tag };
    }

    onChangeTagName = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ name: e.target.value });
    };

    onChangeTagDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ description: e.target.value });
    };

    render() {
        const { name, description } = this.state;
        const { tag, isNew, onClose, show } = this.props;
        return (
            <Modal show={show} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isNew ? "New" : "Edit"} Tag</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTagName" className="mb-3">
                            <Form.Label>Tag Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="tagName"
                                value={name}
                                onChange={this.onChangeTagName}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formTagDesc" className="mb-3">
                            <Form.Label>Tag Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                type="text"
                                name="tagDesc"
                                value={description}
                                onChange={this.onChangeTagDescription}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => onClose()}>
                        Cancel
                    </Button>
                    <Button
                        variant={isNew ? "success" : "primary"}
                        onClick={() => onClose({ ...this.state, _id: tag._id })}
                        disabled={!name}
                    >
                        {isNew ? "Create" : "Save"}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

interface ConfirmDeleteModalProps {
    tag: Tag;
    show: boolean;
    onClose: (id?: string) => void;
}

export const ConfirmDeleteModal = ({ tag, show, onClose }: ConfirmDeleteModalProps): JSX.Element => {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Tag</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete the tag '{tag.name}'? This action cannot be undone.</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => onClose()}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={() => onClose(tag._id)}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
