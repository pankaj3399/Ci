async function getLocationData({ data }) {
    let locationData = {};
    if (data) {
        data?.addressComponents?.map((item, key) => {
            if (item?.types[0] == "administrative_area_level_1") {
                locationData["administrative_area_level_1_short"] = item?.shortText;
                locationData["administrative_area_level_1_long"] = item?.longText;
            } else {
                locationData[item?.types[0]] = item?.types[0] == "country" ? item?.shortText : item?.longText;
            }
        });
    }
    return locationData;
}

async function changeSearchForm({ setPersonalizedValues, change }) {
    setPersonalizedValues({ name: 'location', value: null });
    setPersonalizedValues({ name: 'chosen', value: null });
    setPersonalizedValues({ name: 'geography', value: null });

    await Promise.all([
        change('SearchForm', 'location', null),
        change('SearchForm', 'lat', null),
        change('SearchForm', 'lng', null),
        change('SearchForm', 'geography', null),
        change('SearchForm', 'sw_lat', null),
        change('SearchForm', 'sw_lng', null),
        change('SearchForm', 'ne_lat', null),
        change('SearchForm', 'ne_lng', null),
        change('SearchForm', 'geoType', null),
        change('SearchForm', 'currentPage', 1)
    ]);
}

async function searchFormSuggestSelect({ data, setPersonalizedValues, value }) {
    if (data) {
        const locationData = await getLocationData({ data });
        setPersonalizedValues({ name: 'geography', value: JSON.stringify(locationData) });
        setPersonalizedValues({ name: 'location', value });
        setPersonalizedValues({ name: 'lat', value: data?.location?.latitude });
        setPersonalizedValues({ name: 'lng', value: data?.location?.longitude });
        setPersonalizedValues({ name: 'chosen', value: 1 });
    }
}


async function handleMobileSearchChange({ setPersonalizedValues, change, handleSubmit, value }) {
    setPersonalizedValues({ name: 'location', value });
    setPersonalizedValues({ name: 'lat', value: null });
    setPersonalizedValues({ name: 'lng', value: null });
    setPersonalizedValues({ name: 'geography', value: null });

    if (value == '') {
        await Promise.all([
            change('location', null),
            change('lat', null),
            change('lng', null),
            change('geography', null),
            change('sw_lat', null),
            change('sw_lng', null),
            change('ne_lat', null),
            change('ne_lng', null),
            change('currentPage', 1)
        ]);
        await handleSubmit();
    }
}

async function handleMobileSelectSuggest({ change, handleSubmit, setPersonalizedValues, data, value }) {
    if (data?.addressComponents) {
        let viewport, sw_lat, sw_lng, ne_lat, ne_lng, northEast, southWest;
        viewport = data?.viewport;
        northEast = viewport?.high;
        southWest = viewport?.low;
        sw_lat = southWest?.latitude;
        sw_lng = southWest?.longitude;
        ne_lat = northEast?.latitude;
        ne_lng = northEast?.longitude;
        const locationData = await getLocationData({ data });
        setPersonalizedValues({ name: 'location', value });
        setPersonalizedValues({ name: 'lat', value: data?.location?.latitude });
        setPersonalizedValues({ name: 'lng', value: data?.location?.longitude });
        setPersonalizedValues({ name: 'geography', value: JSON.stringify(locationData) });
        await Promise.all([
            change('location', value),
            change('lat', data?.location?.latitude),
            change('lng', data?.location?.longitude),
            change('geography', JSON.stringify(locationData)),
            change('sw_lat', sw_lat),
            change('sw_lng', sw_lng),
            change('ne_lat', ne_lat),
            change('ne_lng', ne_lng),
            change('currentPage', 1)
        ]);
        await handleSubmit();
    }
}

export {
    changeSearchForm,
    searchFormSuggestSelect,
    handleMobileSearchChange,
    handleMobileSelectSuggest,
    getLocationData
}