const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index'); // Render the homepage
});

app.post('/weather', async (req, res) => {
    const city = req.body.city;
    const apiKey = 'd2f16f7f1c35034702b0a61f25414176'; // Replace with your OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(apiUrl);
        const weatherData = response.data;
        const tomorrowForecast = weatherData.list.find(entry =>
            entry.dt_txt.includes('12:00:00') && 
            new Date(entry.dt_txt).getDate() === new Date().getDate() + 1
        );

        res.render('result', {
            city: weatherData.city.name,
            forecast: tomorrowForecast,
        });
    } catch (error) {
        console.error(error.message);
        res.send("Unable to fetch weather data. Please try again.");
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
