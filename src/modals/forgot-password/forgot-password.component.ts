import { Component, ViewChild, Output, EventEmitter } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LoginComponent } from "../login/login.component";
import { NgForm } from "@angular/forms";
import { AuthService1 } from "../../app/services/auth.service";
import { Router } from "@angular/router";
import { MyToastrService } from "../../app/services/toastr.service";

@Component({
  selector: "forgot-password-modal",
  templateUrl: "./forgot-password.component.html"
})
export class ForgotPasswordComponent {
  // @ViewChild("modalBox") modalBox;
  // @ViewChild("loginModal") loginModal:LoginComponent;
  @ViewChild("form") f: NgForm;

  @Output() onClose = new EventEmitter();
  forgotEmail: any;
  loader = false;

  constructor(
    public modalService: NgbModal,
    private AuthService1: AuthService1,
    private router: Router,
    private toastrService: MyToastrService
  ) {}

  // public open() {
  //   this.modalService.open(this.modalBox);
  // }

  close() {
    this.modalService.dismissAll();

    // modal.close();
    // this.onClose.emit();
  }

  openSignInModal() {
    this.modalService.dismissAll("Open login modal");
    // this.loginModal.open();
    this.modalService.open(LoginComponent,{
      backdrop : 'static',
    });
  }
  openForgotPassword() {
    this.modalService.dismissAll("Open login modal");
    this.modalService.open(ForgotPasswordComponent,{
      backdrop : 'static',
    });
  }
  // closeSignInModal (){
  //     this.open();

  // }
  onForgotPassword(f) {
    if (f.form.status == "INVALID") {
      Object.keys(f.controls).forEach(key => {
        f.controls[key].markAsDirty();
      });
      return;
    }
    if( !this.loader ){
      this.loader = true;
      this.AuthService1.forgotPassword({ email: this.forgotEmail }).subscribe(
        (res: any) => {
          this.loader = false;
          this.toastrService.showToast(res.message, "", "success");
        },
        err => {
          this.loader = false;
          this.toastrService.showToast(err.error.message, "", "error");
        }
      );
    }
  }
}
