import { Component, OnInit } from "@angular/core";
import { HomeService } from "../../services/home.service";

@Component({
  selector: "app-guideline",
  templateUrl: "./guideline.component.html"
})
export class GuidlineComponent implements OnInit {
  aboutData: any;

  constructor(private homeService: HomeService) {}
  
  ngOnInit() {
    
  }
  
}
