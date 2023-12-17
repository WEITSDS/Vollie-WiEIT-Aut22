// import { GoogleMap, LoadScript } from "@react-google-maps/api";

// const MapView = () => {
//     const mapStyles = {
//         height: "400px",
//         width: "100%",
//     };

//     const defaultCenter = {
//         lat: -33.883319,
//         lng: 151.1956764,
//     };

//     return (
//         <LoadScript googleMapsApiKey="AIzaSyCb5fsemucaaV6ffa7aH9zjPWmBwshcSHA">
//             <GoogleMap mapContainerStyle={mapStyles} zoom={13} center={defaultCenter} />
//         </LoadScript>
//     );
// };

// export default MapView;
// MapView.tsx
// MapView.tsx
// MapView.tsx

// import { useState, useEffect } from "react";
// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
// import { getAllAddresses } from "../api/addressAPI";

// type GeocodedAddress = {
//     lat: number;
//     lng: number;
// };

// const MapView = () => {
//     const mapStyles = { height: "400px", width: "100%" };
//     const defaultCenter = { lat: -33.883319, lng: 151.1956764 };
//     const [markers, setMarkers] = useState<GeocodedAddress[]>([]);

//     useEffect(() => {
//         const fetchAddressesAndGeocode = async () => {
//             try {
//                 const addresses = await getAllAddresses();
//                 const geocodedAddresses = await Promise.all(
//                     addresses.map((address) => geocodeAddress(address.address))
//                 );
//                 setMarkers(geocodedAddresses);
//             } catch (error) {
//                 console.error("Error in fetching or geocoding addresses:", error);
//             }
//         };

//         void fetchAddressesAndGeocode();
//     }, []);

//     // For now, this is a mock function. Replace this with actual geocoding logic.
//     const geocodeAddress = (address: string): GeocodedAddress => {
//         console.log(`Geocoding address: ${address}`);
//         // Mock geocoding response
//         return { lat: -33.883319, lng: 151.1956764 };
//     };

//     return (
//         <LoadScript googleMapsApiKey="AIzaSyCb5fsemucaaV6ffa7aH9zjPWmBwshcSHA">
//             <GoogleMap mapContainerStyle={mapStyles} zoom={13} center={defaultCenter}>
//                 {markers.map((marker, index) => (
//                     <Marker key={index} position={marker} />
//                 ))}
//             </GoogleMap>
//         </LoadScript>
//     );
// };

// export default MapView;
// MapView.tsx
// import { useState, useEffect } from "react";
// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
// import { getSearchShifts, IShift } from "../api/shiftApi"; // Import getSearchShifts

// type GeocodedAddress = {
//     lat: number;
//     lng: number;
// };

// const MapView = () => {
//     const mapStyles = { height: "400px", width: "100%" };
//     const defaultCenter = { lat: -33.883319, lng: 151.1956764 };
//     const [markers, setMarkers] = useState<GeocodedAddress[]>([]);

//     useEffect(() => {
//         const fetchShiftsAndGeocode = async () => {
//             try {
//                 const response = await getSearchShifts(undefined); // Fetch shifts (passing undefined as no filters are applied)
//                 if (response.success && response.data) {
//                     const shifts: IShift[] = response.data;
//                     const addresses = shifts.map((shift) => shift.address); // Extract addresses from shifts
//                     const geocodedAddresses = await Promise.all(addresses.map(geocodeAddress));
//                     setMarkers(geocodedAddresses);
//                 }
//             } catch (error) {
//                 console.error("Error in fetching shifts or geocoding addresses:", error);
//             }
//         };

//         void fetchShiftsAndGeocode();
//     }, []);

//     // const geocodeAddress = async (address: string): Promise<GeocodedAddress> => {
//     //     // Implement geocoding logic here
//     //     // For demonstration, returning a mock geocode
//     //     console.log(`Geocoding address: ${address}`);
//     //     return { lat: -33.883319, lng: 151.1956764 };
//     // };

//     const geocodeAddress = (address: string): GeocodedAddress => {
//         console.log(`Geocoding address: ${address}`);
//         // Mock geocoding response
//         return { lat: -33.883319, lng: 151.1956764 };
//     };
//     return (
//         <LoadScript googleMapsApiKey="AIzaSyCb5fsemucaaV6ffa7aH9zjPWmBwshcSHA">
//             <GoogleMap mapContainerStyle={mapStyles} zoom={13} center={defaultCenter}>
//                 {markers.map((marker, index) => (
//                     <Marker key={index} position={marker} />
//                 ))}
//             </GoogleMap>
//         </LoadScript>
//     );
// };

// export default MapView;

import axios from "axios";
import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { getSearchShifts, IShift } from "../api/shiftApi"; // Import getSearchShifts

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

    // useEffect(() => {
    //     const fetchShiftsAndGeocode = async () => {
    //         try {
    //             const response = await getSearchShifts(undefined);

    //             if (response.success && response.data) {
    //                 const fetchedShifts: IShift[] = response.data;
    //                 setShifts(fetchedShifts);

    //                 const geocodedAddresses = await Promise.all(
    //                     fetchedShifts.map((shift) => geocodeAddress(shift.address))
    //                 );
    //                 setMarkers(geocodedAddresses.filter((address) => address !== null) as GeocodedAddress[]);
    //             }
    //         } catch (error) {
    //             console.error("Error in fetching shifts or geocoding addresses:", error);
    //         }
    //     };

    //     void fetchShiftsAndGeocode();
    // }, []);
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
                    key: "AIzaSyCb5fsemucaaV6ffa7aH9zjPWmBwshcSHA",
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

    // const handleMarkerClick = (shift: IShift) => {
    //     setSelectedShift(shift);
    // };

    const handleMarkerClick = (shift: ShiftWithLocation) => {
        setSelectedShift(shift);
    };

    // const renderInfoWindow = () => {
    //     if (selectedShiftIndex !== null) {
    //         const selectedShift = shifts[selectedShiftIndex];
    //         return (
    //             <InfoWindow
    //                 position={markers[selectedShiftIndex]} // Position at the corresponding marker
    //                 onCloseClick={() => setSelectedShiftIndex(null)}
    //             >
    //                 <div>
    //                     <h3>{selectedShift.name}</h3>
    //                     <p>{selectedShift.address}</p>
    //                     {/* You can add more shift details here if needed */}
    //                 </div>
    //             </InfoWindow>
    //         );
    //     }
    //     return null;
    // };

    return (
        <LoadScript googleMapsApiKey="AIzaSyCb5fsemucaaV6ffa7aH9zjPWmBwshcSHA">
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
                            {/* Additional shift details */}
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapView;
