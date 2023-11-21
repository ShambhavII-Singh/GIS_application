import React from "react";
import BusStopsDelhi from "../../components/BusStopsDelhi";

import './Map.css'
import SubHeading from "../../components/Subheading";

const MapContainer = () => {
    return (
        <div className="map__container">
            <div className='instructions'>
                <p>Select two locations from the drop-downs given below to find your best route</p>
            </div>
            <div>
                <BusStopsDelhi />
            </div>
        </div>
    )
}

export default MapContainer;