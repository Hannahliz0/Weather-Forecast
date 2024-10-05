import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const apiKey = process.env.API_KEY; 
const apiUrl = process.env.API_BASE_URL;
const historyFilePath = path.join(__dirname, 'db/searchHistory.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static("../client/dist"));



// API Route to get search history
app.get('/api/weather/history', async (_, res) => {
    try {
        const data = await fs.readFile(historyFilePath, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: 'Failed to read history file' });
    }
});

// API Route to save city and fetch weather data //fix line
app.post('/api/weather', async (req, res) => {
    const cityName = req.body.cityName;
    if (!cityName) {
        return res.status(400).json({ error: 'City name is required' });
    }

    const weatherApiUrl = `${apiUrl}?q=${cityName}&appid=${apiKey}&units=metric`;
    console.log(weatherApiUrl);
    try {
        const response = await axios.get(weatherApiUrl);
        const weatherData = response.data;
        console.log(weatherData);
        const cityEntry = { id: uuidv4(), name: cityName };

        const data = await fs.readFile(historyFilePath, 'utf8');
        const history = JSON.parse(data);
        history.push(cityEntry);

        await fs.writeFile(historyFilePath, JSON.stringify(history, null, 2));
        
        return res.json(weatherData);
    } catch (error) {
        console.log(error); 
        return res.status(500).json({ error: 'Failed to retrieve or save weather data' });
    }
});

// HTML Route
app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
