import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Tag } from "../../api/tagApi";
import { batchChangeUserTag, User } from "../../api/userApi";

interface EditUserTagsProps {
    tags: Tag[];
    onClose: (save?: boolean) => void;
    user: User;
}

interface EditUserTagsState {
    selectedTags: Set<string>;
    saving?: boolean;
}

export class EditUserTagsModal extends React.Component<EditUserTagsProps, EditUserTagsState> {
    constructor(props: EditUserTagsProps) {
        super(props);
        this.state = { selectedTags: new Set(this.props.user.tags.map((t) => t._id)) };
    }

    addOrRemoveTag = ({ _id }: Tag) => {
        const selectedTags = this.state.selectedTags;
        if (selectedTags.has(_id)) {
            selectedTags.delete(_id);
        } else {
            selectedTags.add(_id);
        }
        this.setState({ selectedTags });
    };

    isSelected = ({ _id }: Tag) => this.state.selectedTags.has(_id);

    saveAndClose = () => {
        this.setState({ saving: true });
        batchChangeUserTag({ userId: this.props.user._id, tagIds: Array.from(this.state.selectedTags.values()) })
            .then((resp) => {
                if (resp.success) {
                    this.props.onClose(true);
                }
                this.setState({ saving: false });
            })
            .catch(console.error);
    };

    cancelAndClose = () => {
        this.props.onClose();
    };

    render() {
        const { tags, user } = this.props;
        return (
            <Modal show={true} onHide={this.cancelAndClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Edit {user.firstName} {user.lastName}'s Tags
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTagName" className="mb-3">
                            {tags.map((tag) => (
                                <Form.Check
                                    label={tag.name}
                                    name="group1"
                                    type="checkbox"
                                    checked={this.isSelected(tag)}
                                    id={tag._id}
                                    key={tag._id}
                                    onChange={() => this.addOrRemoveTag(tag)}
                                />
                            ))}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.cancelAndClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={this.saveAndClose}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
