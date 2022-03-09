import { Component } from "@angular/core";
import { HomeService } from "../../services/home.service";
import { MyToastrService } from "../../services/toastr.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html"
})
export class AppFooterComponent {
  email: any;
  constructor(
    private homeService: HomeService,
    private toastrService: MyToastrService
  ) {}

  onSubscribe() {
    this.homeService.emailSubscribe({ email: this.email }).subscribe(
      (res: any) => {
        if (res.status === 200) {
          if(res.success){
            this.email = '';
            localStorage.setItem("currentUser", JSON.stringify(res));
            this.toastrService.showToast(res.message, "", "success");
          }else{
            this.toastrService.showToast(res.message, "", "error");
          }
        }
      },
      err => {
        if (err.status === 401) {
          this.toastrService.showToast(err.error.message, "", "error");
        }
      }
    );
  }
}
