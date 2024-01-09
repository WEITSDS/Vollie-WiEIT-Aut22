import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";

interface ExportUsersModalProps {
    visible: boolean;
    onClose: () => void;
    onExport: () => void;
}

export const ExportUsersModal = ({ visible, onClose, onExport }: ExportUsersModalProps) => {
    return (
        <Modal show={visible} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Export User List</Modal.Title>
            </Modal.Header>
            <Modal.Body>Click "Export" to download the list of users and their roles.</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={onExport}>
                    Export
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
