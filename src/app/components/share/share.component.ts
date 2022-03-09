import { Component, OnInit } from "@angular/core";
import { HomeService } from "../../services/home.service";
import { CommonService } from "../../services/common.service";
import { MyToastrService } from "../../services/toastr.service";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-share",
  templateUrl: "./share.component.html"
})
export class ShareComponent implements OnInit {
  aboutData: any;
  baseUrl:any;

  constructor(
    private homeService: HomeService,
    private toastrService: MyToastrService,
    public commonService: CommonService
    ) { }
  ngOnInit() {
    this.baseUrl = window.location.origin;
    setTimeout(() => {
      this.commonService.isHeaderSearchVisible = true;
    }, 170);
    this.getAboutData();
  }
  getAboutData() {
    this.homeService.getaboutData().subscribe((res: any) => {
      this.aboutData = res.data;
    });
  }

  copyText(){
    let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = environment.shareUrl;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.toastrService.showToast("Link Copied to Clipboard", "", "success");
    }
}
