const baseGeoURL = 'https://api.geoapify.com/v1/geocode';
const baseWeatherURL = 'https://api.openweathermap.org/data/2.5/';

export const geocode = async (text) => {
    const URL = `${baseGeoURL}/search?text=${encodeURIComponent(text)}&limit=15&apiKey=${import.meta.env.VITE_GEOCODING_API_KEY}`;
    try {
        const res = await fetch(URL);
        const data = await res.json();

        const arr = [];
        data.features.map((obj) => {
            const suburb = obj?.properties?.suburb;
            const city = obj?.properties?.city;
            const state = obj?.properties?.state;
            const country = obj?.properties?.country;

            let curr = `${suburb ? `${suburb}, ` : ''}${city ? `${city}, ` : ''}${state}, ${country}`;
            let objData = {
                label: curr,
                value: {
                    address: curr,
                    lat: obj?.properties?.lat,
                    lon: obj?.properties?.lon,
                },
            };
            arr.push(objData);
        });
        return arr;
    } catch (error) {
        console.log('Error in geocode:', error);
    }
    return [];
};

export const reverseGeocode = async (lat, lon) => {
    const URL = `${baseGeoURL}/reverse?lat=${lat}&lon=${lon}&apiKey=${import.meta.env.VITE_GEOCODING_API_KEY}`;
    try {
        const res = await fetch(URL);
        const data = await res.json();
        if (data?.features?.length > 0) {
            const suburb = data?.features[0]?.properties?.suburb;
            const city = data?.features[0]?.properties?.city;
            const state = data?.features[0]?.properties?.state;
            const country = data?.features[0]?.properties?.country;

            let curr = `${suburb ? `${suburb}, ` : ''}${city ? `${city}, ` : ''}${state}, ${country}`;
            return {
                address: curr,
                lat: data?.features[0]?.properties?.lat,
                lon: data?.features[0]?.properties?.lon,
            };
        } else {
            return null;
        }
    } catch (error) {
        console.log('Error in reverseGeocode:', error);
        return null;
    }
};

export const getWeather = async (location, unit) => {
    const unitVal = unit === 'C' ? 'metric' : 'imperial';
    const URL = `${baseWeatherURL}weather?lat=${location.lat}&lon=${location.lon}&units=${unitVal}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`;

    try {
        const data = await fetch(URL);
        const res = await data.json();
        return res;
    } catch (error) {
        console.log('Error in getWeather:', error);
    }
    return {};
};

export const getForecast = async (location, unit) => {
    const unitVal = unit === 'C' ? 'metric' : 'imperial';
    const URL = `${baseWeatherURL}forecast/?lat=${location.lat}&lon=${location.lon}&units=${unitVal}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`;

    try {
        const data = await fetch(URL);
        const res = await data.json();
        return res;
    } catch (error) {
        console.log('Error in getForecast:', error);
    }
    return {};
};
