import esriConfig from '@arcgis/core/config';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Fullscreen from '@arcgis/core/widgets/Fullscreen';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';

import { useEffect, useRef, useState } from 'react';
import Select from 'react-select';

import routingService from '../components/routingService';
import customPopup from '../components/customPopup';
import stopsList from '../assets/json/busStopSelect.json';
import routeLabels from '../components/routeLabels';
import GeoJsonObject from '../assets/json/busStopsGeo.json';
import searchFunctionality from '../components/searchFunctionality';


const BusStopsDelhi = () => {
    const appRef = useRef(); // used to identify where to place map 
    const [selectedOrigin,setSelectedOrigin] = useState(null);
    const [selectedDestination,setSelectedDestination] = useState(null);

    useEffect(() => {
        //API key
        esriConfig.apiKey = "AAPK654ada81dfb94a41bebd71ff4d8f2819nvY5Wma3Hge2PT9Uy6XB14bgnNo_q1zEGBCWwTmloU6F1qtvgkiSTYiSHFlYGT5G";

        //contains data for the layer to render all bus stops
        const geojsonLayer = new GeoJSONLayer({
            url: URL.createObjectURL(new Blob([JSON.stringify(GeoJsonObject)],{type: 'application/json'})), //data
            labelingInfo: [{
                labelExpressionInfo: {expression: "$feature.name"},
                labelPlacement: "above-center",
                symbol: {
                    type: "text",
                    color: [69, 69, 69],
                    backgroundColor: [255, 249, 237, 0.75],
                    borderLineColor: [255, 248, 200],
                    borderLineSize: 1,
                    yoffset: 10,
                    font: {
                        size: 11,
                        family: "Roboto"
                    },
                    horizontalAlignment: "left",
                }
            }],
            renderer: {
                type: "simple",
                field: "name",
                symbol: new PictureMarkerSymbol({
                    "url": './directions_bus.svg',
                    "width": 20,
                    "height": 20,
                }), //bus icon
            } //marker
        });

        //map object
        const map =  new Map({
            basemap: "arcgis-navigation", // Basemap layer service
            layers: [geojsonLayer] //bus stops
        });

        //customize how the map should look
        const view = new MapView({
            map: map,
            center: [77.216721,28.644800], //cooordinates of the default center of the map
            zoom: 11, //default zoom level
            container: appRef.current, //where to place the map
            //to create a popup that appears when no icon is selected
            popup: {
                collapsed: true,
                headingLevel: 3,
                defaultPopupTemplateEnabled: false,
                autoCloseEnabled: true,
                dockEnabled: true,
                dockOptions: {
                    buttonEnabled: false,
                    breakpoint: false,
                    position: "top-right"
                },
                visibleElements: {
                    closeButton: true,
                },
            },
        });

        //fullscreen button appears on the top left side
        view.ui.add(new Fullscreen({
            view: view, //where to place the widget
            element: appRef.current //what to expand
        }), "top-left");

        // enable search bar
        searchFunctionality(view,geojsonLayer,true);


        // shows the route when both origin and destination are defined
        if (selectedDestination && selectedOrigin) {
            
            // add labels
            map.layers.add(routeLabels(selectedOrigin["value"],selectedDestination["value"]));
            // show calculated route on map
            routingService(view,selectedOrigin["value"],selectedDestination["value"]);
        }

        //creates a custom popup for each bus stop
        customPopup(view,geojsonLayer);
        
    }, [selectedDestination, selectedOrigin]); // refreshes whenever origin and destination are defined

    return (
        <div className='map__routing--container'>
            {/* script tag used for multiline labels */}
            <script type="text/plain" id="label-expression">
                return Concatenate([$feature.name,"PM2.5: "+Round($feature.PMAvg)],TextFormatting.NewLine);
            </script>
            <div style={{width:"90%"}} className='map__container'>
                <div ref={appRef}>
                    <div style={{height:"90vh"}}></div>
                </div>
            </div>
            <div className='routing__container'>
                <Select options={stopsList} isSearchable={true} placeholder="Where are you right now? 🫡" value={selectedOrigin} onChange={setSelectedOrigin}/>
                <Select options={stopsList} isSearchable={true} placeholder="Where do you wanna go? 🤔" value={selectedDestination} onChange={setSelectedDestination}/>
            </div>
        </div>
    )
}

export default BusStopsDelhi;