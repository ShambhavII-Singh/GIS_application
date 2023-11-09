import PopupTemplate from "@arcgis/core/PopupTemplate";
import CustomContent from "@arcgis/core/popup/content/CustomContent";
import searchFunctionality from "./searchFunctionality";

const customPopup = (view,geojsonLayer) => {
    view.when(() => {

        //render the search bar widget
        const contentWidget = new CustomContent({
            outFields: ["*"],
            creator: () => {
                return searchFunctionality(view,geojsonLayer,false);
            }
        });

        // This custom content contains the resulting promise from the query
        const contentPromise = new CustomContent({
            outFields: ["*"],
            creator: (event) => {
                const feature = event.graphic.attributes;
                return (`
                    <div>
                        <p>Below are the statistics for <b>${feature.name}</b> Bus Stand<sup>*</sup>:</p>
                        <ul>
                            <li><b>Average PM 2.5 Level:</b> ${Number(feature.PMAvg).toFixed(3)}</li>
                            <li><b>Maximum PM 2.5 Level:</b> ${Number(feature.PMMax).toFixed(3)}</li>
                            <li><b>Average PM 10 Level:</b> ${Number(feature.PM10Avg).toFixed(3)}</li>
                            <li><b>Maximum PM 10 Level:</b> ${Number(feature.PM10Max).toFixed(3)}</li>
                        </ul>
                        <p align="right"><sup>*from months January to July in the year 2022</sup></p>
                    </div>
                `)
            }
        });

        //where to place the custom popup template
        geojsonLayer.popupTemplate = new PopupTemplate({
            outFields: ["*"],
            title: "Bus Stand: {name}",
            content: [contentWidget,contentPromise]
            });
    });
}

export default customPopup;