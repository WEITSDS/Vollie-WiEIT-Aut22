import React, { useState } from "react";
import { Spinner, Button } from "react-bootstrap";
import { Qualification, deleteQualification, getQualifications } from "../../api/qualificationAPI";
import { ConfirmDeleteModal, CreateOrEditQualificationModal } from "./createQualificationModal";

interface QualificationRowProps {
    selectedId: string | undefined;
    qualification: Qualification;
    onRowClick: (qualification: Qualification | undefined) => void;
}

const QualificationRow = ({ onRowClick, selectedId, qualification }: QualificationRowProps) => {
    const [show, setShow] = useState(false);
    return (
        <>
            <tr
                onClick={() => onRowClick(qualification)}
                className={selectedId === qualification._id ? "table-info" : undefined}
            >
                <td style={{ width: "1em" }} className="text-center align-middle" onClick={() => setShow(!show)}>
                    <i className={`bi bi-chevron-${show ? "up" : "down"}`}></i>
                </td>
                <td>
                    <div>
                        <strong>{qualification.title}</strong>
                    </div>
                    <div>{qualification.description}</div>
                </td>
            </tr>
            {show && (
                <tr className="bg-white">
                    <td colSpan={2}>
                        <img src={qualification.filePath}></img>
                    </td>
                </tr>
            )}
        </>
    );
};

interface QualificationSectionProps {
    userId?: string;
    isAdmin?: boolean;
}

interface QualificationSectionState {
    loaded: boolean;
    qualifications: Qualification[];
    selectedQualification?: Qualification;
    errorMessage?: string;
    showCreateModal?: boolean;
    showEditModal?: boolean;
    showDeleteModal?: boolean;
}

export class QualificationsSection extends React.Component<QualificationSectionProps, QualificationSectionState> {
    state: QualificationSectionState = {
        loaded: false,
        qualifications: [],
    };

    componentDidMount = async () => {
        await this.refreshQualifications();
    };

    refreshQualifications = async () => {
        const { isAdmin, userId } = this.props;
        this.setState({ loaded: false });
        const qualResp = await getQualifications(isAdmin ? userId : undefined);
        this.setState({
            loaded: true,
            qualifications: qualResp.data ?? [],
            errorMessage: qualResp.success ? "" : qualResp.message,
        });
    };

    selectQualification = (selectedQualification: Qualification | undefined) => {
        this.setState({ selectedQualification });
    };

    showCreateModal = () => {
        this.setState({ showCreateModal: true });
    };

    showEditModal = () => {
        this.setState({ showEditModal: true });
    };

    showDeleteModal = () => {
        this.setState({ showDeleteModal: true });
    };

    closeModals = () => {
        this.setState({ showCreateModal: false, showDeleteModal: false, showEditModal: false });
    };

    onClose = (success?: boolean) => {
        this.closeModals();
        if (!success) return;
        void this.refreshQualifications();
    };

    onDeleteModalClose = (id: string | undefined) => {
        this.closeModals();
        if (!id) return;
        deleteQualification(id)
            .then(async (resp) => {
                if (!resp.success) {
                    this.setState({ errorMessage: resp.message });
                    return;
                }
                await this.refreshQualifications();
            })
            .catch(console.error);
    };

    render = () => {
        const {
            loaded,
            qualifications,
            showCreateModal,
            errorMessage,
            selectedQualification,
            showEditModal,
            showDeleteModal,
        } = this.state;

        const { isAdmin, userId } = this.props;

        return (
            <>
                <Button title="Add qualification" variant="success" onClick={this.showCreateModal}>
                    <i className="bi bi-plus-square" />
                </Button>
                <Button
                    onClick={this.showEditModal}
                    title={`Edit ${
                        selectedQualification != null ? `'${selectedQualification.title}'` : "qualification"
                    }`}
                    className="mx-3"
                    disabled={!selectedQualification}
                >
                    <i className="bi bi-pencil-square" />
                </Button>
                <Button
                    onClick={this.showDeleteModal}
                    title={`Delete ${
                        selectedQualification != null ? `'${selectedQualification.title}'` : "qualification"
                    }`}
                    variant="danger"
                    disabled={!selectedQualification}
                >
                    <i className="bi bi-trash" />
                </Button>
                {!loaded ? (
                    <Spinner animation="border" />
                ) : (
                    <>
                        {errorMessage && <p>{errorMessage}</p>}
                        {qualifications.length > 0 ? (
                            <table className="table table-hover">
                                <tbody>
                                    {qualifications.map((q, i) => (
                                        <QualificationRow
                                            key={`qualification-${i}`}
                                            onRowClick={this.selectQualification}
                                            qualification={q}
                                            selectedId={selectedQualification?._id}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No qualifications to show!</p>
                        )}
                        {showCreateModal && (
                            <CreateOrEditQualificationModal
                                qualification={{
                                    _id: "",
                                    description: "",
                                    filePath: "",
                                    title: "",
                                    user: isAdmin && userId ? userId : "",
                                    fileId: "",
                                }}
                                onClose={this.onClose}
                                isNew={true}
                            />
                        )}
                        {showEditModal && selectedQualification && (
                            <CreateOrEditQualificationModal
                                qualification={selectedQualification}
                                onClose={this.onClose}
                                isNew={false}
                            />
                        )}
                        {showDeleteModal && selectedQualification && (
                            <ConfirmDeleteModal
                                qualification={selectedQualification}
                                onClose={this.onDeleteModalClose}
                            />
                        )}
                    </>
                )}
            </>
        );
    };
}
