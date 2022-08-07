import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";

export const LOCATIONS: string = "locations";

@Injectable()
export class WeatherService {
  static URL = "https://api.openweathermap.org/data/2.5";
  static APPID = "5a4b2d457ecbef9eb2a71e480b947604";
  static ICON_URL =
    "https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/";
  currentConditions = [];
  locations = [];
  currentConditions$ = new Subject<any[]>();
  buttonUpdate$ = new Subject<boolean>();
  constructor(private http: HttpClient) {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this.locations = JSON.parse(locString);
      //refresh locations every 30 seconds
      setInterval(() => {
        this.refreshLocations();
      }, 30000);
    }
  }

  addCurrentConditions(zipcode: string, id: string) {
    // Here we make a request to get the current conditions data from the API. Note the use of backtick and an expression to insert the zipcode
    this.getCurrentCondition(zipcode, id).subscribe(
      (data) => {
        let index = this.currentConditions.findIndex((el) => el.zip == zipcode);
        if (index != -1) {
          this.currentConditions[index] = { zip: zipcode, data: data }; // update current condition
          this.update(true);
        } else {
          this.currentConditions.push({ zip: zipcode, data: data });
          this.addLocation(zipcode, id);
          this.update(true);
        }
      },
      (err) => this.update(true)
    );
  }

  removeCurrentConditions(zipcode: string) {
    for (let i in this.currentConditions) {
      if (this.currentConditions[i].zip == zipcode)
        this.currentConditions.splice(+i, 1);
    }
  }

  getCurrentCondition(zipcode: string, id) {
    return this.http.get(
      `${WeatherService.URL}/weather?zip=${zipcode},${id}&units=imperial&APPID=${WeatherService.APPID}`
    );
  }

  getForecast(zipcode: string): Observable<any> {
    // Here we make a request to get the forecast data from the API. Note the use of backtick and an expression to insert the zipcode
    return this.http.get(
      `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`
    );
  }
  async refreshLocations() {
    await this.locations.map((zip) => {
      this.addCurrentConditions(zip.zip, zip.id);
    });
    this.currentConditions$.next(this.currentConditions);
  }

  addLocation(zipcode: string, id: string) {
    let index = this.locations.findIndex((el) => el.zip == zipcode);
    if (index == -1) {
      // update only if zipcode not present an
      this.locations.push({ zip: zipcode, id: id });
      this.updateLocalStorage(this.locations);
    }
  }

  removeLocation(zipcode: string) {
    let index = this.locations.findIndex((el) => el.zip == zipcode);
    if (index != -1) {
      this.removeCurrentConditions(zipcode);
      this.locations.splice(index, 1);
      this.updateLocalStorage(this.locations);
    }
  }

  updateLocalStorage(value) {
    localStorage.setItem("locations", JSON.stringify(value));
  }

  update(val) {
    this.buttonUpdate$.next(val);
  }

  getWeatherIcon(id) {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else return WeatherService.ICON_URL + "art_clear.png";
  }
}
