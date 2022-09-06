import { Button, Card, Stack } from "react-bootstrap";

export default function ShiftCard() {
    return (
        <Card style={{ width: "20rem", borderRadius: "1rem" }}>
            <Card.Body>
                <Stack direction="horizontal" gap={5}>
                    <Card.Title>Shift Name Here</Card.Title>
                    <p className="ms-auto">ICON</p>
                </Stack>
                <Card.Text>Location info here</Card.Text>
                <hr />
                <Stack direction="horizontal" style={{ justifyContent: "space-between" }}>
                    <Card.Text>Date info here</Card.Text>
                    <Button style={{ borderRadius: "4rem" }}>View</Button>
                </Stack>
            </Card.Body>
        </Card>
    );
}
