import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

export class Weather {
  constructor(
    public city: string,
    public date: string,
    public description: string,
    public temp: number,
    public humidity: number,
    public wind: number,
    public uvIndex: number
  ) {}
}

class WeatherService {
  private baseURL: string;
  private apiKey: string;
  private cityName: string;

  constructor() {
    this.baseURL = 'http://api.openweathermap.org/data/2.5/weather';
    this.apiKey = process.env.OPENWEATHERMAP_API_KEY || '';
    this.cityName = '';
  }

  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(query);
      if (!response.ok) throw new Error('Location not found.');
      return await response.json();
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw error;
    }
  }

  private destructureLocationData(locationData: any): Coordinates {
    return { lat: locationData[0].lat, lon: locationData[0].lon };
  }

  private buildGeocodeQuery(): string {
    return `http://api.openweathermap.org/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }

  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(query);
    if (!response.ok) throw new Error('Weather data not found.');
    return await response.json();
  }

  private parseCurrentWeather(response: any) {
    const { name } = response;
    const { dt } = response;
    const { description } = response.weather[0];
    const { temp, humidity } = response.main;
    const { speed } = response.wind;
    return new Weather(name, dt, description, temp, humidity, speed, 0);
  }

  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const currentWeatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(currentWeatherData);
    return currentWeather;
  }
}

export default new WeatherService();
