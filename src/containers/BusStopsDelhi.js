import esriConfig from '@arcgis/core/config';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Fullscreen from '@arcgis/core/widgets/Fullscreen';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
import PopupTemplate from "@arcgis/core/PopupTemplate";
import CustomContent from "@arcgis/core/popup/content/CustomContent";
import Search from "@arcgis/core/widgets/Search";
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet.js';
import * as route from "@arcgis/core/rest/route.js";
import Graphic from '@arcgis/core/Graphic';

import { useEffect, useRef } from 'react';
import findRoutes from '../assets/findStops';

const BusStopsDelhi = () => {
    const appRef = useRef(); // used to identify where to place map 
    const originRef = useRef(null); // get value of origin
    const destinationRef = useRef(null); // get value of destination

    function handleClick() {
        console.log(findRoutes(originRef.current.value, destinationRef.current.value));
    }
    
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

            // url to the mapping and routing service
            const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

            // create the origin and destination by clicking
            view.on("click", (event) => {
                if (view.graphics.length === 0) {
                    addGraphic("origin", event.mapPoint);
                } else if (view.graphics.length === 1) {
                    addGraphic("destination", event.mapPoint);
                    getRoute(); // Call the route service
                } else {
                    view.graphics.removeAll();
                    addGraphic("origin",event.mapPoint);
                }
            });

            const addGraphic = (type, point) => {
                const graphic = new Graphic({
                    symbol: {
                        type: "simple-marker",
                        color: (type === "origin") ? "white" : "black",
                        size: "8px"
                    },
                    geometry: point
                });
                view.graphics.add(graphic);
            }

            const getRoute = () => {
                const routeParams = new RouteParameters({
                    stops: new FeatureSet({
                        features: view.graphics.toArray()
                    }),
                    returnDirections: true
            });

            route.solve(routeUrl, routeParams)
                .then(function(data) {
                    data.routeResults.forEach(function(result) {
                        result.route.symbol = {
                        type: "simple-line",
                        color: [5, 150, 255],
                        width: 3
                        };
                        view.graphics.add(result.route);
                    });
                    // Display directions
                    if (data.routeResults.length > 0) {
                        const directions = document.createElement("ol");
                        directions.classList = "esri-widget esri-widget--panel esri-directions__scroller";
                        directions.style.marginTop = "0";
                        directions.style.padding = "15px 15px 15px 30px";
                        const features = data.routeResults[0].directions.features;

                        // Show each direction
                        features.forEach(function(result,i){
                            const direction = document.createElement("li");
                            direction.innerHTML = result.attributes.text + " (" + result.attributes.length.toFixed(2) + " miles)";
                            directions.appendChild(direction);
                        });
                        view.ui.empty("bottom-right");
                        view.ui.add(directions, "bottom-right");
                    }
                })
            .catch(function(error){
                console.log(error);
            })
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

            // This custom content contains the resulting promise from the query
            const contentPromise = new CustomContent({
                outFields: ["*"],

                creator: (event) => {
                    return (
                        `There is a total of <b>{stats.elemCount + stats.secondaryCount + stats.combinedCount}</b> private schools that reside within the state. Out of this total amount of private schools:`
                    )
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
        <>
            <div style={{width:"90%"}}>
                <div ref={appRef}>
                    <div style={{height:"90vh"}}></div>
                </div>
            </div>
            <div>
            <input
        ref={originRef}
        type="number"
        id="message"
        name="message"
      />
      <input
        ref={destinationRef}
        type="number"
        id="message"
        name="message"
      /><button onClick={handleClick}>Log message</button>
            </div>
        </>
    )
}

export default BusStopsDelhi;