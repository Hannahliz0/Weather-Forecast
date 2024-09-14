// TODO: Define a City class with name and id properties
class City {
  name = '';
  id = '';

  City(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
};

// TODO: Complete the HistoryService class
class HistoryService {
  read = async () => {
    const cities = await fs.readFile('searchHistory.json', 'utf8');
    return JSON.parse(cities);
    
  }
  write = async (City) => {
    await fs.writeFile('searchHistory.json', JSON.stringify(cities));
  }
  getCities = async () => {
    const cities = await this.read();
    return cities;
  }
  addCity = async (city) => {
    const cities = await this.read();
    cities.push(city);
    await this.write(cities);
  }
  removeCity = async (id) => {
    const cities = await this.read();
    const updatedCities = cities.filter(city => city.id !== id);
    await this.write(updatedCities);
  }
  
  // TODO: Define a read method that reads from the searchHistory.json file
  // 
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
}

export default new HistoryService();
