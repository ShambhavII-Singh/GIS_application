import data from '../assets/json/busStops.json'

const fetchData = () => {
    Promise.all(data.map((id) => 
        fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${id["coordinates"][1]}&lon=${id["coordinates"][0]}7&appid=${process.env.REACT_APP_OPENWEATHERMAP_API_KEY}`).then(resp => resp.json())
    )).then((result) => {
        try {
            for (var i = 0; i < 40; i++) {
                data[i].PMAvg = result[i]?.list[0]?.components?.pm2_5;
            }
        }
        catch (err) {
            console.log(NaN);
        }
    });
}

export default fetchData;