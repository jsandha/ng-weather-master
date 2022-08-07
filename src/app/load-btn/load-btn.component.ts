import { Component, EventEmitter, Input, Output } from "@angular/core";
import { WeatherService } from "app/weather.service";

@Component({
  selector: "app-load-btn",
  templateUrl: "./load-btn.component.html",
  styleUrls: ["./load-btn.component.css"],
})
export class LoadBtnComponent {
  @Input() isFilled: boolean;
  @Output() ldBtn = new EventEmitter();
  btnClicked = false;
  btnTxt = "Loading...";
  constructor(private service: WeatherService) {
    this.service.buttonUpdate$.subscribe((val) => {
      // button transition delay from status done to Add Location
      this.btnTxt = "Done";
      if (val)
        setTimeout(() => {
          this.btnClicked = false;
          this.btnTxt = "Loading...";
        }, 500);
    });
  }

  buttonClicked() {
    if (this.isFilled) {
      this.btnClicked = true;
      this.ldBtn.emit();
    }
  }
}
