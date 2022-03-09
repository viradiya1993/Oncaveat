import { Component, OnInit } from "@angular/core";
import { HomeService } from "../../services/home.service";

@Component({
  selector: "app-terms",
  templateUrl: "./terms.component.html"
})
export class TermsComponent implements OnInit {
  aboutData: any;

  constructor(private homeService: HomeService) {}
  
  ngOnInit() {
    
  }
  
}
