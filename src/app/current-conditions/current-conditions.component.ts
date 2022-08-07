import { Component } from "@angular/core";
import { WeatherService } from "../weather.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-current-conditions",
  templateUrl: "./current-conditions.component.html",
  styleUrls: ["./current-conditions.component.css"],
})
export class CurrentConditionsComponent {
  currentConditions = [];
  constructor(private weatherService: WeatherService, private router: Router) {
    this.weatherService.refreshLocations();
    this.weatherService.currentConditions$.subscribe((x) => {
      this.currentConditions = x;
    });
  }

  showForecast(zipcode: string) {
    this.router.navigate(["/forecast", zipcode]);
  }

  trackByMethod(index: number, el: any): number {
    return el.zip;
  }
}
