import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService1 } from "../../services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MyToastrService } from "../../services/toastr.service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html"
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild("form") f: NgForm;

  data = {
    password: "",
    confirmPassword: "",
    token: ""
  };

  constructor(
    private AuthService1: AuthService1,
    private router: Router,
    private toastrService: MyToastrService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((param: any) => {
      this.data.token = param["token"];
    });
  }
  ngOnInit() {}
  onReset(f) {
    if (f.invalid) {
      return;
    }
    this.AuthService1.resetPassword(this.data).subscribe(
      (res: any) => {
        if (res.status === 200) {
          localStorage.setItem("currentUser", JSON.stringify(res));
          this.toastrService.showToast(res.message, "", "success");
          this.router.navigate(["/"]);
        }
      },
      err => {
        if (err) {
          this.toastrService.showToast(err.error.message, "", "error");
        }
      }
    );
  }
}
