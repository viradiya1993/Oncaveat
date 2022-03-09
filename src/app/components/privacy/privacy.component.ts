import { Component, OnInit } from "@angular/core";
import { HomeService } from "../../services/home.service";

@Component({
  selector: "app-privacy",
  templateUrl: "./privacy.component.html"
})
export class PrivacyComponent implements OnInit {
  constructor(private homeService: HomeService) {}

  ngOnInit() {

  }

}
