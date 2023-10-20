import esriConfig from '@arcgis/core/config';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Fullscreen from '@arcgis/core/widgets/Fullscreen';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';

import { useEffect, useRef, useState } from 'react';
import routingService from '../components/routingService';
import customPopup from '../components/customPopup';
import stopsList from '../assets/busStopSelect.json';
import Select from 'react-select';


const BusStopsDelhi = () => {
    const appRef = useRef(); // used to identify where to place map 
    const [selectedOrigin,setSelectedOrigin] = useState(null);
    const [selectedDestination,setSelectedDestination] = useState(null);

    useEffect(() => {
        //API key
        esriConfig.apiKey = "AAPK654ada81dfb94a41bebd71ff4d8f2819nvY5Wma3Hge2PT9Uy6XB14bgnNo_q1zEGBCWwTmloU6F1qtvgkiSTYiSHFlYGT5G";

        //contains data for the layer to render all bus stops
        const geojsonLayer = new GeoJSONLayer({
            url: "./busStopsGeo.json", //data
            renderer: {
                type: "simple",
                field: "name",
                symbol: new PictureMarkerSymbol({
                    "url": './directions_bus.svg',
                    "width":20,
                    "height":20,
                }), //bus icon
            }, //marker
        });

        //customize how the map should look
        const view = new MapView({
            map: new Map({
                basemap: "arcgis-navigation", // Basemap layer service
                layers: [geojsonLayer] //bus stops
            }), //map object
            center: [77.216721,28.644800], //cooordinates of the default center of the map
            zoom: 10.5, //default zoom level
            container: appRef.current, //where to place the map
            popup: {
                defaultPopupTemplateEnabled: false,
                dockEnabled: true,
                dockOptions: {
                    buttonEnabled: false,
                    breakpoint: false
                },
                visibleElements: {
                    closeButton: false,
                },
            },
        });

        //fullscreen button appears on the top left side
        view.ui.add(new Fullscreen({
            view: view, //where to place the widget
            element: appRef.current //what to expand
        }), "top-left");

        // shows the route when both origin and destination are defined
        if (selectedDestination && selectedOrigin) {
            routingService(view,selectedOrigin["value"],selectedDestination["value"]);
        }

        //creates a custom popup for each bus stop
        customPopup(view,geojsonLayer);
        
    }, [selectedDestination, selectedOrigin]);

    return (
        <>
            <div style={{width:"90%"}}>
                <div ref={appRef}>
                    <div style={{height:"90vh"}}></div>
                </div>
            </div>
            <div>
                <Select options={stopsList} isSearchable={true} placeholder="Where are you right now? 🫡" value={selectedOrigin} onChange={setSelectedOrigin}/>
                <Select options={stopsList} isSearchable={true} placeholder="Where do you wanna go? 🤔" value={selectedDestination} onChange={setSelectedDestination}/>
            </div>
        </>
    )
}

export default BusStopsDelhi;