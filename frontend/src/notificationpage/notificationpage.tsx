import "./notificationpage.css";
/*import { NavigationBar } from "../components/navbar";
import { WEITBackground } from "../components/background";
import ModalBody from "react-bootstrap/ModalBody";
import { useOwnUser } from "../hooks/useOwnUser";
import { useMyShifts } from "../hooks/useMyShifts";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import LoadingSpinner from "../components/loadingSpinner";
import { ResponseWithStatus } from "../api/utility";
import { useMyNotifications } from "../hooks/useMyNotifications";
import { useUserById } from "../hooks/useUserById";
import { useParams } from "react-router-dom";

export const NotificationPage = () => {
    const { id } = useParams();
    const { isLoading, data: userData, refetch: refetchUser, error } = id ? useUserById(id) : useOwnUser();

    const {
        isLoading = true,
        isError,
        data,
        error,
        refetch: refetchNotifcations,
    } = useMyNotifications(userData?.data?._id);

    const [show, setShow] = useState<boolean>(false);
}*/