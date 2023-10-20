import PopupTemplate from "@arcgis/core/PopupTemplate";
import CustomContent from "@arcgis/core/popup/content/CustomContent";
import Search from "@arcgis/core/widgets/Search";

const customPopup = (view,geojsonLayer) => {
    view.when(() => {

        //to create a popup that appears when no icon is selected
        view.openPopup({
            title: "Bus Stands of New Delhi",
            content: `<div>
                        <p>General instructions:</p>
                        <ul>
                            <li>Click on the bus icons for more information</li>
                            <li>Drag to navigate through the map</li>
                            <li>Use two fingers to zoom in and out</li>
                            <li>Click on any bus icon to search by name</li>
                            <li>Use the drop-downs given below for calculating the cleanest route</li>
                        </ul>
                    </div>`,
        });

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

        //clear the search bar once the search is successful
        searchWidget.on("search-complete", () => {
            searchWidget.clear();
        });

        searchWidget.on("select-result", (searchResult) => {
            view.goTo(searchResult.extent);
        })

        //render the search bar widget
        const contentWidget = new CustomContent({
            outFields: ["*"],
            creator: () => {
                return searchWidget;
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