// Select DOM elements
const searchForm = document.getElementById('search-form') as HTMLFormElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const todaySection = document.getElementById('today');
const forecastSection = document.getElementById('forecast');
const historySection = document.getElementById('history');

// Event listener for the search form submission
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = searchInput.value.trim();
    if (city) {
        saveCityAndFetchWeather(city);
    }
});

// Function to send city data to the backend and fetch weather information
async function saveCityAndFetchWeather(city: string): Promise<void> {
    try {
        const response = await fetch('/api/weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ city })
        });

        if (!response.ok) {
            throw new Error('Failed to retrieve weather data.');
        }

        const data = await response.json();
        displayWeather(data);
        fetchAndDisplayHistory();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to retrieve weather data. Please try again later.');
    }
}

// Function to display weather data in the "today" section
function displayWeather(data: any): void {
    if (todaySection) {
        todaySection.innerHTML = `
            <h2>${data.city}</h2>
            <p>Date: ${data.date}</p>
            <p>Description: ${data.description}</p>
            <p>Temperature: ${Math.round(data.temp)}°C</p>
            <p>Wind: ${data.wind} m/s</p>
            <p>Humidity: ${data.humidity}%</p>
            <p>UV Index: ${data.uvIndex}</p>
        `;

        // If you have forecast data, you can display it here:
        if (forecastSection && Array.isArray(data.forecast)) {
            forecastSection.innerHTML = data.forecast
                .map((forecastItem: any) => `
                    <div class="forecast-item">
                        <h3>${forecastItem.date}</h3>
                        <p>Description: ${forecastItem.description}</p>
                        <p>Temperature: ${Math.round(forecastItem.temp)}°C</p>
                        <p>Wind: ${forecastItem.wind} m/s</p>
                        <p>Humidity: ${forecastItem.humidity}%</p>
                    </div>
                `)
                .join('');
        }
    }
}

// Fetch and display the search history from the backend
async function fetchAndDisplayHistory(): Promise<void> {
    try {
        const response = await fetch('/api/weather/history');
        if (!response.ok) {
            throw new Error('Failed to retrieve history.');
        }

        const history = await response.json();
        if (historySection) {
            historySection.innerHTML = history
                .map((city: { id: string; name: string }) =>
                    `<button class="list-group-item" data-city="${city.name}">${city.name}</button>`
                )
                .join('');
        }
    } catch (error) {
        console.error('Error fetching history:', error);
    }
}

// Initial history fetch on page load
fetchAndDisplayHistory();

// Event delegation to handle click events on history buttons
if (historySection) {
    historySection.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.matches('[data-city]')) {
            const city = target.getAttribute('data-city');
            if (city) saveCityAndFetchWeather(city);
        }
    });
}
