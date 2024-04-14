import { IShift } from "../api/shiftApi";
import { useVoltypesForUser } from "../hooks/useVolTypesForUser";
import { Button, Card, Stack } from "react-bootstrap";
import locationIcon from "../assets/location.svg";
import calendarIcon from "../assets/calendar.svg";
import { useState } from "react";
import { VolunteerFeedbackForm } from "./volunteerFeedbackForm";
import { AmbassadorFeedbackForm } from "./ambassadorFeedbackForm";
import { SproutFeedbackForm } from "./sproutFeedbackForm";
import { LeadSproutFeedbackForm } from "./leadSproutFeedbackForm";

type FeedbackCardProps = {
    shiftData: IShift;
    userId: string | undefined;
};

export default function FeedbackCard({ shiftData, userId }: FeedbackCardProps) {
    const { name, startAt, address, volunteerTypeAllocations } = shiftData;
    const { data: userVolTypesData } = useVoltypesForUser(userId);

    // show forms based on volunteer roles
    const userVolTypes = userVolTypesData?.data;
    const shiftVolTypes = volunteerTypeAllocations;
    const volType = userVolTypes?.find((userVolType) => {
        return shiftVolTypes?.some((shiftVolType) => userVolType._id === shiftVolType.type);
    });

    // testing
    console.log(volType);
    console.log(userVolTypes);
    console.log(shiftVolTypes);

    const [showFeedbackForm, setShowFeedbackForm] = useState<boolean>(false);

    const handleFeedbackForm = () => {
        setShowFeedbackForm(true);
    };

    const dateString = new Date(startAt).toLocaleString([], {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    const latoFont = {
        fontFamily: "Lato",
        fontStyle: "normal",
    };

    const titleTextStyle = {
        fontSize: "25px",
        fontWeight: "600",
        lineHeight: "30px",
        ...latoFont,
    };

    const commonTextStyle = {
        fontSize: "20px",
        fontWeight: "500",
        lineHeight: "24px",
        ...latoFont,
    };

    const buttonTextStyle = {
        fontSize: "16px",
        fontWeight: "400",
        lineHeight: "19px",
        color: "#FFFDFD",
        ...latoFont,
    };

    const onFeedbackFormClose = () => {
        // change to async once api done
        setShowFeedbackForm(false);
        //await refetchVolTypeUser(); TODO when api finished
    };

    return (
        <>
            <Card
                style={{
                    width: "25rem",
                    padding: "0.5rem",
                    borderRadius: "1rem",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    margin: "15px",
                }}
            >
                <Card.Body>
                    <Stack direction="horizontal" style={{ justifyContent: "space-between" }}>
                        <Card.Title style={titleTextStyle}>{name}</Card.Title>
                    </Stack>
                    <Card.Text as="h6" style={{ color: "#4D41D8", ...commonTextStyle }}>
                        <img style={{ margin: "0 10px 0 0" }} src={locationIcon} alt="location icon" />
                        {address}
                    </Card.Text>
                    <hr />
                    <Stack direction="horizontal" style={{ justifyContent: "space-between" }}>
                        <Card.Text as="h6" style={commonTextStyle}>
                            <img style={{ margin: "0 5px 0 0" }} src={calendarIcon} alt="date icon" />
                            {dateString}
                        </Card.Text>
                        <Button
                            style={{ borderRadius: "4rem", padding: "0.5rem 1.5rem", ...buttonTextStyle }}
                            variant="success"
                            onClick={() => handleFeedbackForm()}
                        >
                            {"Complete"}
                        </Button>
                        {showFeedbackForm && volType?.name === "General Volunteer" && (
                            <VolunteerFeedbackForm
                                onClose={() => {
                                    void onFeedbackFormClose();
                                }}
                            />
                        )}
                        {showFeedbackForm &&
                            volType?.name === "Ambassador " && ( // there's a space after name
                                <AmbassadorFeedbackForm
                                    onClose={() => {
                                        void onFeedbackFormClose();
                                    }}
                                />
                            )}
                        {showFeedbackForm && volType?.name === "SPROUT" && (
                            <SproutFeedbackForm
                                onClose={() => {
                                    void onFeedbackFormClose();
                                }}
                            />
                        )}
                        {showFeedbackForm && volType?.name === "Lead SPROUT" && (
                            <LeadSproutFeedbackForm
                                onClose={() => {
                                    void onFeedbackFormClose();
                                }}
                            />
                        )}
                    </Stack>
                </Card.Body>
            </Card>
        </>
    );
}
