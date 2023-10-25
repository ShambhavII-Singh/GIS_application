import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import findRoutes from "./findStops";
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';

const routeLabels = (origin,destination) => {
    // where to place labels
    const object = findRoutes(origin,destination);
    
    //create seperate geojson layer to assign labels
    const labellingLayer = new GeoJSONLayer({
        // obtain url of dynamically calculated geoJson object
        url : URL.createObjectURL(new Blob([JSON.stringify(object[2])],{type: 'application/json'})),
        // style of label
        labelingInfo: [{
            labelExpressionInfo: {expression : document.getElementById("label-expression").text},
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
        // assign a transarent renderer so that only labels are visible
        renderer: {
            type: "simple",
            field: "name",
            symbol: new SimpleMarkerSymbol({
                size: 4,
                color: "transparent",
                outline: null
            }),
        }
    });
    
    return labellingLayer;
}

export default routeLabels;