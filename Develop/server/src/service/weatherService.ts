import dotenv from 'dotenv';
dotenv.config();
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}

// TODO: Define a class for the Weather object
export class Weather {
  city = '';
  date = '';
  description = '';
  temp = 0;
  humidity = 0;
  wind = 0;
  uvIndex = 0;

  constructor(city: string, date: string, description: string, temp: number, humidity: number, wind: number, uvIndex: number) {
    this.city = city;
    this.date = date;
    this.description = description;
    this.temp = temp;
    this.humidity = humidity;
    this.wind = wind;
    this.uvIndex = uvIndex;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
 private baseURL: string;
  private apiKey: string;
  private cityName: string;
  private query: string;

  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5/';
    this.apiKey = '';
    this.cityName = '';
    this.query = '';
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(query);
      if (!response.ok) {
        console.log('Location not found.');
      }else {
        const locationData = await response.json();
        return locationData;
      }
    } catch (error) {
    }  
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const lat = locationData.latitude;
    const lon  = locationData.longitude;

    return { latitude: lat, longitude: lon };
  }
  
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}geocode?city=${this.cityName}&appid=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(query);
    if (!response.ok) {
      console.log('Weather data not found.');
    } else {
      const weatherData = await response.json();
      return weatherData;
    }
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const { name } = response;
    const { dt } = response;
    const { description } = response.weather[0];
    const { temp, humidity } = response.main;
    const { speed } = response.wind;
    const { uvi } = response;
    return new Weather(name, dt, description, temp, humidity, speed, uvi);
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray = [];
    forecastArray.push(currentWeather);
    for (let i = 1; i < weatherData.length; i++) {
      const { dt } = weatherData[i];
      const { description } = weatherData[i].weather[0];
      const { temp, humidity } = weatherData[i].main;
      const { speed } = weatherData[i].wind;
      const { uvi } = weatherData[i];
      forecastArray.push(new Weather(currentWeather.city, dt, description, temp, humidity, speed, uvi));
    }
    return forecastArray;
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const currentWeatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(currentWeatherData);
    const forecastData = await this.fetchWeatherData(coordinates);
    const forecastArray = this.buildForecastArray(currentWeather, forecastData);
    return forecastArray;
  }
}

export default new WeatherService();
