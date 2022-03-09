import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService1 } from "../../services/auth.service";
import { Router } from "@angular/router";
import { MyToastrService } from "../../services/toastr.service";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html"
})
export class ChangePasswordComponent implements OnInit {
  @ViewChild("form") f: NgForm;

  data = {
    password: "",
    new_password: "",
    confirmPassword: ""
  };

  constructor(
    private AuthService1: AuthService1,
    private router: Router,
    private toastrService: MyToastrService
  ) {}
  ngOnInit() {}
  onChange(f) {
    if (f.form.status == "INVALID") {
      Object.keys(f.controls).forEach(key => {
        f.controls[key].markAsDirty();
      });
      return;
    }
    this.AuthService1.changePassword(this.data).subscribe(
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
