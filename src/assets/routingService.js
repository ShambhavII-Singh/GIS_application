import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet.js';
import * as route from "@arcgis/core/rest/route.js";
import Graphic from '@arcgis/core/Graphic';
import findRoutes from './findStops';

const routingService = (view,origin,destination) => {
    // url to the mapping and routing service
    const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

    // create the origin and destination by clicking
    const stops = findRoutes(origin,destination);

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
        return graphic;
    }

    function getRoute(origin,destination) {
        const routeParams = new RouteParameters({
            apiKey: "AAPK654ada81dfb94a41bebd71ff4d8f2819nvY5Wma3Hge2PT9Uy6XB14bgnNo_q1zEGBCWwTmloU6F1qtvgkiSTYiSHFlYGT5G",
            stops: new FeatureSet(),
            returnDirections: true
        });

        routeParams.stops.features.push(addGraphic("origin", origin));
        routeParams.stops.features.push(addGraphic("destination", destination));

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
        //  if (data.routeResults.length > 0) {
        //    const directions = document.createElement("ol");
        //    directions.classList = "esri-widget esri-widget--panel esri-directions__scroller";
        //    directions.style.marginTop = "0";
        //    directions.style.padding = "15px 15px 15px 30px";
        //    const features = data.routeResults[0].directions.features;

        //    // Show each direction
        //    features.forEach(function(result,i){
        //      const direction = document.createElement("li");
        //      direction.innerHTML = result.attributes.text + " (" + result.attributes.length.toFixed(2) + " miles)";
        //      directions.appendChild(direction);
        //    });

        //   view.ui.empty("top-right");
        //   view.ui.add(directions, "top-right");

        //  }

        })

        .catch(function(error){
            console.log(error);
        })
    }

    // view.on("click", (event) => {
    //     if (view.graphics.length === 0) {
    //         addGraphic("origin", event.mapPoint);
    //     } else if (view.graphics.length === 1) {
    //         addGraphic("destination", event.mapPoint);
    //         getRoute(); // Call the route service
    //     } else {
    //         view.graphics.removeAll();
    //         addGraphic("origin",event.mapPoint);
    //     }
    // });
    for (let i = 0; i < stops.length-1; i++) {
        getRoute(stops[i],stops[i+1]); // Call the route service
    }
    

}

export default routingService;