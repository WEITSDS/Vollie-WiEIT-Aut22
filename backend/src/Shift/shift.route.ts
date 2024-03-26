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

router.get("/get-user-shifts/:userid", wrapAsync(getUserShifts));
router.post("/get-search-shifts", wrapAsync(getSearchShifts));
router.post("/admin-export-shifts", wrapAsync(exportAdminShifts));
router.post("/volunteer-export-shifts", wrapAsync(exportVolunteerShifts));
router.get("/shift/:shiftid", wrapAsync(getShiftById));
router.get("/calendar/:userid", wrapAsync(generateShiftCalendar));
router.get("/attendance-list/:shiftid", wrapAsync(getShiftAttendanceList));
router.get("/available-roles-for-shift-user/:userid/:shiftid", wrapAsync(getAvailableRolesForShiftUser));
router.get("/total-user-hours/:userid", wrapAsync(getTotalHoursWorked));

router.post("/create", wrapAsync(createShift));
router.post("/update/:shiftid", wrapAsync(updateShift));

router.patch("/:shiftid/assign-user/:userid/:selectedVolunteerTypeID", wrapAsync(assignUser));
router.patch("/:shiftid/unassign-user/:userid", wrapAsync(removeUser));
router.patch("/:shiftid/approve-user/:userid/:approvalstatus", wrapAsync(setUserApproval));

router.delete("/:shiftid", wrapAsync(deleteShift));
router.get("/get-all-shifts", wrapAsync(getAllShifts));
router.post("/get-volunteer-report", wrapAsync(getVolunteerReport));
router.post("/export-report-excel", wrapAsync(exportVolunteerReportAsExcel));
//router.get("/get-shifts-address", wrapAsync(getAllUniqueShiftAddresses));

export = router;
