import esriConfig from '@arcgis/core/config';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import { useEffect, useRef } from 'react';

const BusStopsDelhi = () => {
    const mapRef = useRef();
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
            title: "{name} Bus Stop",
            content: "PM2.5 rating: {PM2.5Avg} (Average) & {PM2.5Max} (Maximum)",
        };

        //renders a bus stop icon for each bus stop
        const renderer = {
            type: "simple",
            field: "name",
            symbol: picSymbol, //bus icon
        };

        //contains data for the layer to render all bus stops
        const geojsonLayer = new GeoJSONLayer({
            url: "./busStops.json", //data
            popupTemplate: template, //tooltip
            renderer: renderer, //marker
        });

        //create a map object
        const map = new Map({
            basemap: "arcgis-navigation", // Basemap layer service
            layers: [geojsonLayer] //bus stops
        });

        //customize how the map should look
        // eslint-disable-next-line no-unused-vars
        const view = new MapView({
            map: map, //map object
            center: [77.216721,28.644800], //cooordinates of the default center of the map
            zoom: 11, //default zoom level
            container: mapRef.current //where to place the map
        });
    }, []);

    return <div id="MapView" ref={mapRef} style={{width:"100%", height:"100vh"}}></div>
}

export default BusStopsDelhi;