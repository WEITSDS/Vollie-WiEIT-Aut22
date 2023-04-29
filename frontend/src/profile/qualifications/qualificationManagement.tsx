import { useState } from "react";
import { Button, Table, Modal } from "react-bootstrap";
import { deleteQualification, Qualification, setApprovalUserQualification } from "../../api/qualificationAPI";
// import { Qualification, NewQualification } from "../../api/qualificationAPI";
import { useQualificationsForUserById } from "../../hooks/useQualificationsForUserById";
import { ConfirmDeleteModal, CreateOrEditQualificationModal } from "./createQualificationModal";

// interface QualificationRowProps {
//     selectedId: string | undefined;
//     qualification: Qualification;
//     onRowClick: (qualification: Qualification | undefined) => void;
// }

// const QualificationRow = ({ onRowClick, selectedId, qualification }: QualificationRowProps) => {
//     const [show, setShow] = useState(false);
//     return (
//         <>
//             <tr
//                 onClick={() => onRowClick(qualification)}
//                 className={selectedId === qualification._id ? "table-info" : undefined}
//             >
//                 <td style={{ width: "1em" }} className="text-center align-middle" onClick={() => setShow(!show)}>
//                     <i className={`bi bi-chevron-${show ? "up" : "down"}`}></i>
//                 </td>
//                 <td>
//                     <div>
//                         <strong>{qualification.title}</strong>
//                     </div>
//                     <div>{qualification.description}</div>
//                 </td>
//             </tr>
//             {show && (
//                 <tr className="bg-white">
//                     <td colSpan={2}>
//                         <img src={qualification.filePath}></img>
//                     </td>
//                 </tr>
//             )}
//         </>
//     );
// };

interface QualificationSectionProps {
    userId?: string;
    isAdmin?: boolean;
    // onFinishAddingQualification?: () => void;
}

// interface QualificationSectionState {
//     loaded: boolean;
//     qualifications: Qualification[];
//     selectedQualification?: Qualification;
//     errorMessage?: string;
//     showCreateModal?: boolean;
//     showEditModal?: boolean;
//     showDeleteModal?: boolean;
// }

export const QualificationsSection = ({ userId, isAdmin }: QualificationSectionProps) => {
    const {
        data: userQualifications,
        isLoading: isLoadingQualifications,
        refetch: refetchQualifications,
    } = useQualificationsForUserById(userId);
    const [showCreateModal, setshowCreateModal] = useState(false);
    const [showDeleteModal, setshowDeleteModal] = useState(false);

    const [selectedQualification, setselectedQualification] = useState<Qualification | null>(null);

    const [showQualificationModal, setShowQualificationModal] = useState(false);

    const handleDeleteModalClose = async (shouldDelete: boolean) => {
        try {
            setshowDeleteModal(false);

            if (selectedQualification && shouldDelete) await deleteQualification(selectedQualification?._id);

            await refetchQualifications();
            setselectedQualification(null);
        } catch (error) {
            console.log(error);
        }
    };

    const handleQualificationDelete = (qual: Qualification) => {
        console.log(isAdmin);
        setshowDeleteModal(true);
        setselectedQualification(qual);
    };

    const handleCreateQualification = () => {
        setshowCreateModal(true);
    };

    const onCreateClose = async () => {
        setshowCreateModal(false);
        console.log("handle close");
        await refetchQualifications();
    };

    const handleShowQualification = (qual: Qualification) => {
        setselectedQualification(qual);
        setShowQualificationModal(true);
    };

    const handleSetApproval = async (qualId: string, status: string) => {
        try {
            if (userId) {
                await setApprovalUserQualification(qualId, userId, status);
                await refetchQualifications();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="qualification-table">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Qualification Type</th>
                        <th>Approval Status</th>
                        <th>Delete</th>
                        <th>Evidence</th>
                        {isAdmin && <th>Set Approval</th>}
                    </tr>
                </thead>
                <tbody>
                    {!isLoadingQualifications &&
                        userQualifications?.data?.map((qual) => {
                            return (
                                <tr key={qual._id}>
                                    <td>{qual.title}</td>
                                    <td>{qual.qualificationType.name}</td>
                                    <td>{qual.approved ? "Yes" : "No"}</td>
                                    <td>
                                        <Button
                                            onClick={() => handleQualificationDelete(qual)}
                                            title={`Delete`}
                                            variant="danger"
                                        >
                                            <i className="bi bi-trash" />
                                        </Button>
                                    </td>
                                    <td>
                                        <Button onClick={() => handleShowQualification(qual)} title={`Evidence`}>
                                            Evidence
                                        </Button>
                                    </td>
                                    {isAdmin && (
                                        <td>
                                            {qual.approved ? (
                                                <Button onClick={() => void handleSetApproval(qual._id, "revoke")}>
                                                    Revoke
                                                </Button>
                                            ) : (
                                                <Button onClick={() => void handleSetApproval(qual._id, "approve")}>
                                                    Approve
                                                </Button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
            <Button title="Add qualification" variant="success" onClick={() => handleCreateQualification()}>
                Add Qualification {"   "}
                <i className="bi bi-plus-square" />
            </Button>
            {showCreateModal && (
                <CreateOrEditQualificationModal
                    qualification={{
                        _id: "",
                        description: "",
                        filePath: "",
                        title: "",
                        user: isAdmin && userId ? userId : "",
                        qualificationType: "",
                        fileId: "",
                    }}
                    onClose={() => {
                        void onCreateClose();
                    }}
                    isNew={true}
                />
            )}
            {showDeleteModal && selectedQualification && (
                <ConfirmDeleteModal
                    qualification={selectedQualification}
                    onClose={(shouldDelete: boolean) => void handleDeleteModalClose(shouldDelete)}
                />
            )}
            <Modal
                show={showQualificationModal}
                onHide={() => {
                    setShowQualificationModal(false);
                    setselectedQualification(null);
                }}
            >
                <Modal.Header>
                    <Modal.Title>Qualification Evidence</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="add-shift-form">
                        {selectedQualification ? (
                            <>
                                <p>Name: {selectedQualification.title}</p>
                                <p>Description: {selectedQualification?.description}</p>
                                <p>Approval Status: {selectedQualification.approved ? "Yes" : "No"}</p>
                                <img src={selectedQualification.filePath}></img>
                            </>
                        ) : (
                            <p>No Qualification Selected</p>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => {
                            setShowQualificationModal(false);
                            setselectedQualification(null);
                        }}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

// export class QualificationsSection extends React.Component<QualificationSectionProps, QualificationSectionState> {
//     state: QualificationSectionState = {
//         loaded: false,
//         qualifications: [],
//     };

//     componentDidMount = async () => {
//         await this.refreshQualifications();
//     };

//     refreshQualifications = async () => {
//         const { isAdmin, userId } = this.props;
//         this.setState({ loaded: false });
//         if (this.props.onFinishAddingQualification) this.props.onFinishAddingQualification();
//         const qualResp = await getQualifications(isAdmin ? userId : undefined);
//         this.setState({
//             loaded: true,
//             qualifications: qualResp.data ?? [],
//             errorMessage: qualResp.success ? "" : qualResp.message,
//         });
//     };

//     selectQualification = (selectedQualification: Qualification | undefined) => {
//         this.setState({ selectedQualification });
//     };

//     showCreateModal = () => {
//         this.setState({ showCreateModal: true });
//     };

//     showEditModal = () => {
//         this.setState({ showEditModal: true });
//     };

//     showDeleteModal = () => {
//         this.setState({ showDeleteModal: true });
//     };

//     closeModals = () => {
//         this.setState({ showCreateModal: false, showDeleteModal: false, showEditModal: false });
//     };

//     onClose = (success?: boolean) => {
//         this.closeModals();
//         if (!success) return;
//         void this.refreshQualifications();
//     };

//     onDeleteModalClose = (id: string | undefined) => {
//         this.closeModals();
//         if (!id) return;
//         deleteQualification(id)
//             .then(async (resp) => {
//                 if (!resp.success) {
//                     this.setState({ errorMessage: resp.message });
//                     return;
//                 }
//                 await this.refreshQualifications();
//             })
//             .catch(console.error);
//     };

//     render = () => {
//         const {
//             loaded,
//             qualifications,
//             showCreateModal,
//             errorMessage,
//             selectedQualification,
//             showEditModal,
//             showDeleteModal,
//         } = this.state;

//         const { isAdmin, userId } = this.props;

//         return (
//             <>
//                 <Button title="Add qualification" variant="success" onClick={this.showCreateModal}>
//                     <i className="bi bi-plus-square" />
//                 </Button>
//                 <Button
//                     onClick={this.showEditModal}
//                     title={`Edit ${
//                         selectedQualification != null ? `'${selectedQualification.title}'` : "qualification"
//                     }`}
//                     className="mx-3"
//                     disabled={!selectedQualification}
//                 >
//                     <i className="bi bi-pencil-square" />
//                 </Button>
//                 <Button
//                     onClick={this.showDeleteModal}
//                     title={`Delete ${
//                         selectedQualification != null ? `'${selectedQualification.title}'` : "qualification"
//                     }`}
//                     variant="danger"
//                     disabled={!selectedQualification}
//                 >
//                     <i className="bi bi-trash" />
//                 </Button>
//                 {!loaded ? (
//                     <Spinner animation="border" />
//                 ) : (
//                     <>
//                         {errorMessage && <p>{errorMessage}</p>}
//                         {qualifications.length > 0 ? (
//                             <table className="table table-hover">
//                                 <tbody>
//                                     {qualifications.map((q, i) => (
//                                         <QualificationRow
//                                             key={`qualification-${i}`}
//                                             onRowClick={this.selectQualification}
//                                             qualification={q}
//                                             selectedId={selectedQualification?._id}
//                                         />
//                                     ))}
//                                 </tbody>
//                             </table>
//                         ) : (
//                             <p>No qualifications to show!</p>
//                         )}
//                         {showCreateModal && (
//                             <CreateOrEditQualificationModal
//                                 qualification={{
//                                     _id: "",
//                                     description: "",
//                                     filePath: "",
//                                     title: "",
//                                     user: isAdmin && userId ? userId : "",
//                                     qualificationType: "",
//                                     fileId: "",
//                                 }}
//                                 onClose={this.onClose}
//                                 isNew={true}
//                             />
//                         )}
//                         {showEditModal && selectedQualification && (
//                             <CreateOrEditQualificationModal
//                                 qualification={selectedQualification}
//                                 onClose={this.onClose}
//                                 isNew={false}
//                             />
//                         )}
//                         {showDeleteModal && selectedQualification && (
//                             <ConfirmDeleteModal
//                                 qualification={selectedQualification}
//                                 onClose={this.onDeleteModalClose}
//                             />
//                         )}
//                     </>
//                 )}
//             </>
//         );
//     };
// }
