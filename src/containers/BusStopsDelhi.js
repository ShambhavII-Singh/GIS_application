import esriConfig from '@arcgis/core/config';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Fullscreen from '@arcgis/core/widgets/Fullscreen';
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
            container: mapRef.current //where to place the map
        });

        //adding a fullscreen button
        const fullscreen = new Fullscreen({
            view: view //where to place the widget
        });
        view.ui.add(fullscreen, "top-right");
        
    }, []);

    return <div id="MapView" ref={mapRef} style={{width:"100%", height:"80vh"}}></div>
}

export default BusStopsDelhi;