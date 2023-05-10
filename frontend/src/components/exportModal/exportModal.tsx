/* eslint-disable @typescript-eslint/no-misused-promises */
import { ExportModalProps } from "./types";
import Modal from "react-bootstrap/Modal";
import "./styles.css";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker, Range } from "react-date-range";
import { useState } from "react";
import { useAdminExportShifts } from "../../hooks/useAdminExportShifts";
import { useVolunteerExportShifts } from "../../hooks/useVolunteerExportShifts";

export const ExportModal = (props: ExportModalProps): JSX.Element => {
    const { visible, onClose, isAdmin } = props;
    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
    });

    const exportShiftsMutation = isAdmin ? useAdminExportShifts() : useVolunteerExportShifts();

    const exportDetails = async () => {
        if (dateRange.startDate && dateRange.endDate) {
            const response = await exportShiftsMutation.mutateAsync({
                start: dateRange.startDate,
                end: dateRange.endDate,
            });

            if (response.data?.csv) {
                const link = document.createElement("a");
                link.setAttribute("href", response.data?.csv);
                link.setAttribute(
                    "download",
                    `shift_export_${dateRange.startDate.toDateString()}-${dateRange.endDate.toDateString()}.csv`
                );
                document.body.appendChild(link);

                link.click();
            }
        }
    };

    return (
        <Modal
            show={visible}
            onHide={() => onClose()}
            contentClassName="content-modal"
            className="export-modal"
            size="lg"
        >
            <Modal.Header>
                <Modal.Title>Export</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="export-modal-content">
                    <label className="range-label">Date Range To Export</label>
                    <br />
                    <DateRangePicker
                        className="range-date-picker"
                        ranges={[dateRange]}
                        onChange={(newRange) => {
                            if (newRange["selection"]) {
                                setDateRange(newRange["selection"]);
                                console.log("change", newRange);
                            }
                        }}
                    />
                    <br />
                    <button className="btn-primary btn-export" onClick={async () => exportDetails()}>
                        Export
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};
