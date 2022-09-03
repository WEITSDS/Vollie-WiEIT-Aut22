import React from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { createTag, deleteTag, getAllTags, Tag, updateTag } from "../../api/tagApi";
import { ConfirmDeleteModal, CreateOrEditTagModal } from "./tagModals";
import { ModalBody } from "react-bootstrap";
import { NavigationBar } from "../../components/navbar";
import { WEITBackground } from "../../components/background";
import { setPageTitle } from "../../utility";

function tagCompare(a: Tag, b: Tag): number {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
}

interface TagRowProps {
    selectedId: string | undefined;
    tag: Tag;
    onRowClick: (tag: Tag) => void;
}

const TagRow = ({ tag, onRowClick, selectedId }: TagRowProps): JSX.Element => {
    return (
        <tr onClick={() => onRowClick(tag)} className={selectedId === tag._id ? "table-info" : undefined}>
            <td className="col-8">
                <div>
                    <strong>{tag.name}</strong> ({tag.userCount} user{tag.userCount !== 1 ? "s" : ""})
                </div>
                <div>{tag.description}</div>
            </td>
        </tr>
    );
};

interface TagManagementState {
    tags: Tag[];
    selectedTag: Tag | undefined;
    errorMessage: string;
    loading: boolean;
    showDeleteModal?: boolean;
    showEditModal?: boolean;
    showCreateModal?: boolean;
}

export class TagManagement extends React.Component<Record<string, never>, TagManagementState> {
    state: TagManagementState = {
        errorMessage: "",
        tags: [],
        loading: true,
        selectedTag: undefined,
    };

    constructor(props: Record<string, never>) {
        super(props);
        setPageTitle("Tags");
    }

    componentDidMount = async (): Promise<void> => {
        await this.loadAllTags();
    };

    onTagClick = (selectedTag: Tag) => {
        this.setState({ selectedTag });
    };

    showEditModal = () => {
        if (!this.state.selectedTag) return;
        this.setState({ showEditModal: true });
    };

    showCreateModal = () => {
        this.setState({ showCreateModal: true });
    };

    showDeleteModal = () => {
        if (!this.state.selectedTag) return;
        this.setState({ showDeleteModal: true });
    };

    onCreateClick = (newTag?: Tag): void => {
        this.clearSelectedTagAndCloseModals();
        if (!newTag) return;
        createTag({ name: newTag.name, description: newTag.description || "" })
            .then((resp) => {
                const errorMessage = resp.success ? "" : resp.message;
                const tags = this.state.tags;
                if (resp.success && resp.data) {
                    const createdTag = resp.data;
                    tags.push(createdTag);
                    tags.sort(tagCompare);
                }
                this.setState({ errorMessage, tags });
            })
            .catch(console.error);
    };

    onEditClick = (updatedTag?: Tag): void => {
        this.clearSelectedTagAndCloseModals();
        if (!updatedTag) return;
        updateTag(updatedTag)
            .then((resp) => {
                const errorMessage = resp.success ? "" : resp.message;
                const tags = this.state.tags;
                if (resp.success) {
                    const index = tags.findIndex((t) => t._id === updatedTag._id);
                    tags[index] = { ...updatedTag };
                }
                this.setState({ errorMessage, tags });
            })
            .catch(console.error);
    };

    clearSelectedTagAndCloseModals = () => {
        this.setState({ selectedTag: undefined, showDeleteModal: false, showEditModal: false, showCreateModal: false });
    };

    onDeleteModalClose = (tagId?: string): void => {
        this.clearSelectedTagAndCloseModals();
        if (!tagId) return;
        deleteTag(tagId)
            .then((resp) => {
                // If success, filter out the deleted tag :)
                const errorMessage = resp.success ? "" : resp.message;
                const tags = resp.success ? this.state.tags.filter((t) => t._id !== tagId) : this.state.tags;
                this.setState({ errorMessage, tags });
            })
            .catch(console.error);
    };

    loadAllTags = async (): Promise<void> => {
        const resp = await getAllTags();
        let tags: Tag[] = [];
        let errorMessage = "";
        if (!(resp.success && resp.data)) {
            errorMessage = resp.message;
        } else {
            tags = resp.data;
        }
        tags.sort(tagCompare);
        this.setState({ tags, loading: false, errorMessage });
    };

    render() {
        const { tags, loading, errorMessage, showDeleteModal, showEditModal, showCreateModal, selectedTag } =
            this.state;
        return (
            <>
                <NavigationBar />
                <WEITBackground>
                    <ModalBody>
                        <div
                            className=".container-fluid"
                            style={{
                                backgroundColor: "whitesmoke",
                                padding: "30px",
                                maxHeight: "100%",
                                maxWidth: "100%",
                            }}
                        >
                            <h1 className="text-center">Tags</h1>
                            {errorMessage && <p>{errorMessage}</p>}
                            <div className="text-center mt-4">
                                <Button onClick={this.showCreateModal} title="Create tag" variant="success">
                                    <i className="bi bi-plus-square" />
                                </Button>
                                <Button
                                    onClick={this.showEditModal}
                                    title={`Edit ${selectedTag != null ? `'${selectedTag.name}'` : "tag"}`}
                                    className="mx-3"
                                    disabled={!selectedTag}
                                >
                                    <i className="bi bi-pencil-square" />
                                </Button>
                                <Button
                                    onClick={this.showDeleteModal}
                                    title={`Delete ${selectedTag != null ? `'${selectedTag.name}'` : "tag"}`}
                                    variant="danger"
                                    disabled={!selectedTag}
                                >
                                    <i className="bi bi-trash" />
                                </Button>
                            </div>

                            {loading ? (
                                <Spinner animation="border" />
                            ) : tags.length !== 0 ? (
                                <>
                                    <table className="table table-hover">
                                        <tbody>
                                            {tags.map((tag) => (
                                                <TagRow
                                                    selectedId={selectedTag?._id}
                                                    key={tag._id}
                                                    tag={tag}
                                                    onRowClick={this.onTagClick}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                    <p className="text-center">Total {tags.length} tags</p>
                                </>
                            ) : (
                                <p>No tags to show!</p>
                            )}
                            {showDeleteModal && selectedTag && (
                                <ConfirmDeleteModal
                                    show={showDeleteModal}
                                    tag={selectedTag}
                                    onClose={this.onDeleteModalClose}
                                />
                            )}
                            {showEditModal && selectedTag && (
                                <CreateOrEditTagModal
                                    show={showEditModal}
                                    tag={selectedTag}
                                    onClose={this.onEditClick}
                                />
                            )}
                            {showCreateModal && (
                                <CreateOrEditTagModal
                                    tag={{ _id: "", name: "", description: "", userCount: 0 }}
                                    isNew={true}
                                    show={showCreateModal}
                                    onClose={this.onCreateClick}
                                />
                            )}
                        </div>
                    </ModalBody>
                </WEITBackground>
            </>
        );
    }
}
