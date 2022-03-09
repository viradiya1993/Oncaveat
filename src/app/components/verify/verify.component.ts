import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService1 } from "../../services/auth.service";
import { MyToastrService } from "../../services/toastr.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-verify",
  templateUrl: "./verify.component.html"
})
export class VerifyComponent implements OnInit {
  token: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private AuthService1: AuthService1,
    private toastrService: MyToastrService
  ) {
    this.token = this.route.snapshot.paramMap.get("token");
    console.log("Token", this.token);
  }
  ngOnInit() {
    this.verifyUser();
  }

  verifyUser() {
    this.AuthService1.verifyUser({ token: this.token }).subscribe((res: any) => {
      if (res.status == 200) {
        this.toastrService.showToast(res.message, "Success", "success");
        this.router.navigate(["/"]);

      }
    }, ( err:HttpErrorResponse ) =>{

      if( err.error && err.error.message ){

        this.toastrService.showToast(err.error.message, "Error", "error");
      }else{

        this.toastrService.showToast("Token expired or mismatch ! Please re request.", "Error", "error");
      }
      this.router.navigate(["/"]);
    });
  }
}
