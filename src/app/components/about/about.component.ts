import { Component, OnInit } from "@angular/core";
import { HomeService } from "../../services/home.service";
import { environment } from "../../../environments/environment";

const redirect_url = environment.redirect_URL;

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html"
})
export class AboutComponent implements OnInit {
  aboutData: any;
  summary_url = redirect_url+'caselaws'
  casebook_url = redirect_url+'casebook-new'
  
  constructor(private homeService: HomeService) {}
  ngOnInit() {
    // this.getAboutData();
  }
  // getAboutData() {
  //   this.homeService.getaboutData().subscribe((res: any) => {
  //     this.aboutData = res.data;
  //   });
  // }
}
