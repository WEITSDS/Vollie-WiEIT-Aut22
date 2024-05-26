import express from "express";
import { wrapAsync } from "../utility";
import {
    createShift,
    assignUser,
    removeUser,
    deleteShift,
    getUserShifts,
    generateShiftCalendar,
    getShiftById,
    getShiftAttendanceList,
    updateShift,
    getAvailableRolesForShiftUser,
    setUserApproval,
    getSearchShifts,
    exportAdminShifts,
    exportVolunteerShifts,
    getAllShifts,
    getVolunteerReport,
    exportVolunteerReportAsExcel,
    getTotalHoursWorked,
} from "./shift.controller";

const router = express.Router();

router.get("/get-user-shifts/:userId", wrapAsync(getUserShifts));
router.post("/get-search-shifts", wrapAsync(getSearchShifts));
router.post("/admin-export-shifts", wrapAsync(exportAdminShifts));
router.post("/volunteer-export-shifts", wrapAsync(exportVolunteerShifts));
router.get("/shift/:shiftId", wrapAsync(getShiftById));
router.get("/calendar/:userId", wrapAsync(generateShiftCalendar));
router.get("/attendance-list/:shiftId", wrapAsync(getShiftAttendanceList));
router.get("/available-roles-for-shift-user/:userId/:shiftId", wrapAsync(getAvailableRolesForShiftUser));
router.get("/total-user-hours/:userId", wrapAsync(getTotalHoursWorked));

router.post("/create", wrapAsync(createShift));
router.post("/update/:shiftId", wrapAsync(updateShift));

router.patch("/:shiftId/assign-user/:userId/:selectedVolunteerTypeID", wrapAsync(assignUser));
router.patch("/:shiftId/unassign-user/:userId", wrapAsync(removeUser));
router.patch("/:shiftId/approve-user/:userId/:approvalStatus", wrapAsync(setUserApproval));

router.delete("/:shiftId", wrapAsync(deleteShift));
router.get("/get-all-shifts", wrapAsync(getAllShifts));
router.post("/get-volunteer-report", wrapAsync(getVolunteerReport));
router.post("/export-report-excel", wrapAsync(exportVolunteerReportAsExcel));
//router.get("/get-shifts-address", wrapAsync(getAllUniqueShiftAddresses));

export = router;
