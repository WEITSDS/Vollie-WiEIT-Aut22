import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import "./addAddressForm.css"; // You should create this CSS file to style your form

type HandleClose = () => void;

type AddAddressFormProps = {
    handleClose: HandleClose;
};

const AddAddressForm: React.FC<AddAddressFormProps> = ({ handleClose }) => {
    const [address, setAddress] = useState({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log(address);
        // Here you would typically send the address data to your server
        handleClose(); // Close form after submission
    };

    return (
        <div className="add-address-form">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formStreet">
                    <Form.Label>Street</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter street"
                        name="street"
                        value={address.street}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter city"
                        name="city"
                        value={address.city}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formState">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter state"
                        name="state"
                        value={address.state}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formPostalCode">
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter postal code"
                        name="postalCode"
                        value={address.postalCode}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formCountry">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter country"
                        name="country"
                        value={address.country}
                        onChange={handleChange}
                    />
                </Form.Group>

                <button type="submit" className="btn btn-primary">
                    Add Address
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                    Close
                </button>
            </Form>
        </div>
    );
};

export default AddAddressForm;
