import fs from 'fs';

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;
  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    fs.readFile('searchHistory.json', 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
      }
    }
    )};


  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]){
    fs.writeFile('searchHistory.json', JSON.stringify(cities), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('City added successfully');
      }
    });
  }


  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const cities = await this.read();
    return cities;
  }


  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    fs.readFile('searchHistory.json', 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const cities = JSON.parse(data);
        cities.push(city);
        this.write(cities);
      }
    }
    )
  }


  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    fs.readFile('searchHistory.json', 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const cities = JSON.parse(data);
        const updatedCities = cities.filter((city: City) => city.id !== id);
        this.write(updatedCities);
      }
    }
    )
  }

}

export default new HistoryService();