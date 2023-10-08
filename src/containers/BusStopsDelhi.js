import esriConfig from '@arcgis/core/config';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Fullscreen from '@arcgis/core/widgets/Fullscreen';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
import PopupTemplate from "@arcgis/core/PopupTemplate";
import CustomContent from "@arcgis/core/popup/content/CustomContent";
import Search from "@arcgis/core/widgets/Search";
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import { useEffect, useRef } from 'react';

const BusStopsDelhi = () => {
    const appRef = useRef();
    useEffect(() => {

        //API key
        esriConfig.apiKey = "AAPK654ada81dfb94a41bebd71ff4d8f2819nvY5Wma3Hge2PT9Uy6XB14bgnNo_q1zEGBCWwTmloU6F1qtvgkiSTYiSHFlYGT5G";
        
        //custom svg marker for bus stops
        const picSymbol = new PictureMarkerSymbol({
            "url": './directions_bus.svg',
            "width":20,
            "height":20,
        });

        //renders an on-click tooltip
        const template = {
            title: "{name}",
            content: "PM2.5 rating: {PMAvg} (Average) & {PMMax} (Maximum)",
        };

        //renders a bus stop icon for each bus stop
        const renderer = {
            type: "simple",
            field: "name",
            symbol: picSymbol, //bus icon
        };

        //contains data for the layer to render all bus stops
        const geojsonLayer = new GeoJSONLayer({
            url: "./busStopsGeo.json", //data
            popupTemplate: template, //tooltip
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
            }
        });

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
                searchAllEnabled: false,
                suggestionsEnabled: true,
                sources: [{
                    layer: geojsonLayer, //from where  to search
                    searchFields: ["name"], //which fields are searchable
                    displayField: "name",
                    exactMatch: false,
                    outFields: ["*"],
                    name: "Stand name",
                    placeholder: "Search by name...",
                }]
            });

            //to create a popup that appears when no icon is selected
            view.openPopup({
                title: "Bus Stands of New Delhi",
                content: "Click on the bus icons to view statistics or search by name...",
            });

            //render the search bar widget
            const contentWidget = new CustomContent({
                outFields: ["*"],
                creator: () => {
                    return searchWidget;
                }
            });

            //clear the search bar once the search is successful
            searchWidget.on("search-complete", (searchResult) => {
                searchWidget.clear();
            });

            // custom content of pollution temperature humidity
            const contentPromise = new CustomContent({
            outFields: ["*"],
            creator: (event) => {
                
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
        
    }, []);

    return (
        <div style={{width:"90%"}}>
            <div ref={appRef}>
                <div style={{height:"90vh"}}></div>
            </div>
        </div>
    )
}

export default BusStopsDelhi;