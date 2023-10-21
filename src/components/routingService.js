import React, { useState } from 'react';
import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet.js';
import * as route from "@arcgis/core/rest/route.js";
import Graphic from '@arcgis/core/Graphic';
import findRoutes from './findStops';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine'

import Lottie from 'lottie-react';
import breathingAnimation from '../assets/animations/breathingAnimation.json';

const routingService = (view,origin,destination) => {
    // icon svg string
    const TourPinTearIcon = '<svg width="20" height="20" fill="currentColor" viewBox="0 0 32 32" class="calcite-icon"><path d="M26 31.057l-.68-.06C15.138 30.778 3 29.91 3 27c0-1.355 2.293-1.776 4.947-2.264C9.16 24.514 12 23.992 12 23.5c0-.44-2.475-1.208-5.548-1.502L6 21.954V21l1 .049c2.11.232 6 .875 6 2.451 0 1.325-2.15 1.72-4.872 2.22C6.788 25.966 4 26.478 4 27c0 1.263 7.331 2.697 21.342 2.996l.145.004H26zM11.9 8.086C11.9 10.893 9.222 14.692 7 19c-2.222-4.308-4.9-8.107-4.9-10.914A4.96 4.96 0 0 1 7 3a4.96 4.96 0 0 1 4.9 5.086zm-4.01 7.19c1.548-2.761 3.01-5.37 3.01-7.19A3.954 3.954 0 0 0 7 4a3.954 3.954 0 0 0-3.9 4.086c0 1.82 1.462 4.429 3.01 7.19.292.524.592 1.058.89 1.601.298-.543.598-1.077.89-1.6zM9.13 8A2.13 2.13 0 1 1 7 5.834 2.147 2.147 0 0 1 9.13 8zm-1 0A1.13 1.13 0 1 0 7 9.166 1.15 1.15 0 0 0 8.13 8zm21.77 9.086c0 2.807-2.678 6.606-4.9 10.914-2.222-4.308-4.9-8.107-4.9-10.914a4.903 4.903 0 1 1 9.8 0zm-4.01 7.19c1.548-2.761 3.01-5.37 3.01-7.19a3.905 3.905 0 1 0-7.8 0c0 1.82 1.461 4.429 3.01 7.19.292.524.592 1.058.89 1.601.298-.543.598-1.077.89-1.6zM27.13 17A2.13 2.13 0 1 1 25 14.834 2.147 2.147 0 0 1 27.13 17zm-1 0A1.13 1.13 0 1 0 25 18.166 1.15 1.15 0 0 0 26.13 17z"></path></svg>';
    
    // url to the mapping and routing service
    const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

    // create the origin and destination by clicking
    const stops = findRoutes(origin,destination)[0];
    const stats = findRoutes(origin,destination)[1];

    const addGraphic = (type, point) => {
        const graphic = new Graphic({
            symbol: {
                type: "simple-marker",
                color: (type === "origin") ? 
                "white" : (type === "destination") ?
                "black" : (type === "intermediate") ? 
                "red" : null,
                size: "8px"
            },
            geometry: point
        });
        view.graphics.add(graphic);
        return graphic;
    }

    const routeParams = new RouteParameters({
        apiKey: "AAPK654ada81dfb94a41bebd71ff4d8f2819nvY5Wma3Hge2PT9Uy6XB14bgnNo_q1zEGBCWwTmloU6F1qtvgkiSTYiSHFlYGT5G",
        stops: new FeatureSet(),
        returnDirections: false,
        accumulateAttributes: ["kilometers"],
        restrictUTurns: "at-dead-ends-and-intersections",
        geometryPrecision: null
    });

    function getRoute(origin,destination,parameterOrigin,parameterDestination) {
        
        routeParams.stops.features.push(addGraphic(parameterOrigin, origin));
        routeParams.stops.features.push(addGraphic(parameterDestination, destination));
        
        route
        .solve(routeUrl, routeParams)
        .then(function(data) {
            
            
            window.localStorage.setItem("routeLength",routeLength);
            console.log(window.localStorage.getItem("routeLength"))
            data.routeResults.forEach(function(result) {             
                result.route.symbol = {
                    type: "simple-line",
                    color: "#F40505",
                    width: 3
                };
                view.graphics.add(result.route);
            });
        })
        .catch(function(error){
            console.log(error);
        })
    }
    console.log(window.localStorage.getItem("routeLength"));
    const showStatistics = (stats) => {
        
        const statistics = document.createElement("div");
        statistics.classList = "esri-widget esri-widget--panel";
        statistics.style.width = "100%";
        statistics.style.marginTop = "0";
        statistics.style.padding = "15px";
        statistics.style.fontSize = "14px"
        const heading = document.createElement("h3");
        heading.innerHTML = "Route Statistics";
        statistics.appendChild(heading);

        const table = document.createElement("div");
        table.style.lineHeight = "25px";
        table.innerHTML = `<table>
                            <tr>
                                <th>Starting Point</th>
                                <td>${stats.places.origin}</td>
                            </tr>
                            <tr>
                                <th>Destination Point</th>
                                <td>${stats.places.destination}</td>
                            </tr>
                            <tr>
                                <th>Average PM 2.5 level</th>
                                <td>${Number(stats.info.average).toFixed(3)}</td>
                            </tr>
                            <tr>
                                <th>Maximum PM 2.5 level</th>
                                <td>${Number(stats.highest.aqi).toFixed(3)}</td>
                            </tr>
                            <tr>
                                <th>Most Polluted</th>
                                <td>${stats.highest.name}</td>
                            </tr>
                            <tr>
                                <th>Health rating</th>
                                <td>${stats.info.rating}</td>
                            </tr>
                        </table>`
        statistics.appendChild(table);
        return statistics;
    }

    for (let i = 0; i < stops.length-1; i++) {
        let parameterDestination,parameterOrigin;
        parameterDestination = "intermediate";
        parameterOrigin = "intermediate";
        if (i===0) {
            parameterOrigin = "origin";
        }
        if (i+1===stops.length-1) {
            parameterDestination = "destination";
        }
        getRoute(stops[i],stops[i+1],parameterOrigin,parameterDestination); // Call the route service
    }    
    window.localStorage.setItem("routeLength","0");
    if (origin!==destination) {
        view.ui.add(showStatistics(stats), "bottom-right");
    }
}

export default routingService;