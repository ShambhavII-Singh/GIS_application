import Search from "@arcgis/core/widgets/Search";

const searchFunctionality = (view,geojsonLayer,toView) => {
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

        //zoom to selected location
        searchWidget.on("select-result", (searchResult) => {
            view.goTo(searchResult.feature.geometry);
        })

        // add only when adding to view and not on popup
        if (toView) {
            view.ui.add(searchWidget, "top-right");
        }
        else {
            return searchWidget;
        }
}

export default searchFunctionality;