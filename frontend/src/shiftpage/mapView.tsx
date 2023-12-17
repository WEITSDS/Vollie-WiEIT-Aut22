import axios from "axios";
import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { getSearchShifts, IShift } from "../api/shiftApi";

type GeocodedAddress = {
    lat: number;
    lng: number;
};
interface ShiftWithLocation extends IShift {
    location: GeocodedAddress | null;
}
interface GeocodeResult {
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
}

interface GeocodeResponse {
    status: string;
    results: GeocodeResult[];
}

const MapView = () => {
    const mapStyles = { height: "400px", width: "100%" };
    const defaultCenter = { lat: -33.883319, lng: 151.1956764 };
    const [shiftsWithLocations, setShiftsWithLocations] = useState<ShiftWithLocation[]>([]);
    const [selectedShift, setSelectedShift] = useState<ShiftWithLocation | null>(null);

    useEffect(() => {
        const fetchShiftsAndGeocode = async () => {
            try {
                const response = await getSearchShifts(undefined);

                if (response.success && response.data) {
                    const fetchedShifts: IShift[] = response.data;
                    const shiftsAndLocations = await Promise.all(
                        fetchedShifts.map(async (shift) => {
                            const geocoded = await geocodeAddress(shift.address);
                            return { ...shift, location: geocoded };
                        })
                    );
                    setShiftsWithLocations(shiftsAndLocations);
                }
            } catch (error) {
                console.error("Error in fetching shifts or geocoding addresses:", error);
            }
        };

        void fetchShiftsAndGeocode();
    }, []);

    const geocodeAddress = async (address: string): Promise<GeocodedAddress | null> => {
        try {
            const response = await axios.get<GeocodeResponse>("https://maps.googleapis.com/maps/api/geocode/json", {
                params: {
                    address: address,
                    key: "A",
                },
            });

            console.log(`Geocoding result for "${address}":`, response.data); // Log the geocode response

            if (response.data.status === "OK") {
                const { lat, lng } = response.data.results[0].geometry.location;
                return { lat, lng };
            } else {
                console.error("Geocoding failed:", response.data.status);
                return null;
            }
        } catch (error) {
            console.error("Error during geocoding:", error);
            return null;
        }
    };

    const handleMarkerClick = (shift: ShiftWithLocation) => {
        setSelectedShift(shift);
    };

    return (
        <LoadScript googleMapsApiKey="A">
            <GoogleMap mapContainerStyle={mapStyles} zoom={13} center={defaultCenter}>
                {shiftsWithLocations.map(
                    (shift, index) =>
                        shift.location && (
                            <Marker key={index} position={shift.location} onClick={() => handleMarkerClick(shift)} />
                        )
                )}

                {selectedShift && selectedShift.location && (
                    <InfoWindow position={selectedShift.location} onCloseClick={() => setSelectedShift(null)}>
                        <div>
                            <h3>{selectedShift.name}</h3>
                            <p>{selectedShift.address}</p>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapView;
