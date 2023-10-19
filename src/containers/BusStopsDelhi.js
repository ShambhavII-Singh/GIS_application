import esriConfig from '@arcgis/core/config';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Fullscreen from '@arcgis/core/widgets/Fullscreen';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
import PopupTemplate from "@arcgis/core/PopupTemplate";
import CustomContent from "@arcgis/core/popup/content/CustomContent";
import Search from "@arcgis/core/widgets/Search";
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';

import { useEffect, useRef, useState } from 'react';
import routingService from '../components/routingService';
import stopsList from '../assets/busStopSelect.json';
import Select from 'react-select';


const BusStopsDelhi = () => {
    const appRef = useRef(); // used to identify where to place map 
    const [selectedOrigin,setSelectedOrigin] = useState(null);
    const [selectedDestination,setSelectedDestination] = useState(null);

    useEffect(() => {
        //API key
        esriConfig.apiKey = "AAPK654ada81dfb94a41bebd71ff4d8f2819nvY5Wma3Hge2PT9Uy6XB14bgnNo_q1zEGBCWwTmloU6F1qtvgkiSTYiSHFlYGT5G";
        
        //custom svg marker for bus stops
        const picSymbol = new PictureMarkerSymbol({
            "url": './directions_bus.svg',
            "width":20,
            "height":20,
        });

        //renders a bus stop icon for each bus stop
        const renderer = {
            type: "simple",
            field: "name",
            symbol: picSymbol, //bus icon
        };

        //contains data for the layer to render all bus stops
        const geojsonLayer = new GeoJSONLayer({
            url: "./busStopsGeo.json", //data
            renderer: renderer, //marker
        });

        //create a map object
        const map = new Map({
            basemap: "arcgis-navigation", // Basemap layer service
            layers: [geojsonLayer] //bus stops
        });
        

        //customize how the map should look
        const view = new MapView({
            map: map, //map object
            center: [77.216721,28.644800], //cooordinates of the default center of the map
            zoom: 11, //default zoom level
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
                }
            },
        });

        // shows the route when both origin and destination are defined
        if (selectedDestination && selectedOrigin) {
            routingService(map,view,selectedOrigin["value"],selectedDestination["value"]);
        }
        else {
            routingService(map,view,null,null);
        }

        //adding a fullscreen button
        const fullscreen = new Fullscreen({
            view: view, //where to place the widget
            element: appRef.current //what to expand
        });
        //fullscreen button appears on the top left side
        view.ui.add(fullscreen, "top-left");
        
        view.when(() => {
            //create a search widget
            let searchWidget = new Search({
                view: view, //where to place
                includeDefaultSources: false,
                locationEnabled: false,
                popupEnabled: true,
                suggestionsEnabled: true,
                minSuggestCharacters: 1,
                maxSuggestions:20,
                sources: [{
                    layer: geojsonLayer, //from where  to search
                    searchFields: ["name"], //which fields are searchable
                    displayField: "name",
                    exactMatch: false,
                    outFields: ["*"],
                    placeholder: "Bus Stand",
                }]
            });

            //to create a popup that appears when no icon is selected
            view.openPopup({
                title: "Bus Stands of New Delhi",
                content: `<ul>
                            <li>Click on the bus icons for more information</li>
                            <li>Drag to navigate through the map</li>
                        </ul>`,
            });

            //render the search bar widget
            const contentWidget = new CustomContent({
                outFields: ["*"],
                creator: () => {
                    return searchWidget;
                }
            });

            //clear the search bar once the search is successful
            searchWidget.on("search-complete", () => {
                searchWidget.clear();
            });

            searchWidget.on("select-result", (searchResult) => {
                view.goTo(searchResult.extent);
            })

    
            
            // This custom content contains the resulting promise from the query
            const contentPromise = new CustomContent({
                outFields: ["*"],
                creator: (event) => {
                    const feature = event.graphic.attributes;
                    return (`
                        <div>
                            <p>Below are the statistics for <b>${feature.name}</b> Bus Stand:</p>
                            <ul>
                                <li><b>Average PM2.5 Level:</b> ${Number(feature.PMAvg).toFixed(3)}</li>
                                <li><b>Maximum PM2.5 Level:</b> ${Number(feature.PMMax).toFixed(3)}</li>
                            </ul>
                            <sup>*from months January to July in the year 2022</sup>
                        </div>
                    `)
                }
            });
            // what to display when an icon is clicked
            const template = new PopupTemplate({
            outFields: ["*"],
            title: "Bus Stand: {name}",
            content: [contentWidget,contentPromise]
            });

            //where to place the custom popup template
            geojsonLayer.popupTemplate = template;
        });
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