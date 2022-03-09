import { Component, ViewChild, Output, EventEmitter } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LoginComponent } from "../login/login.component";
import { NgForm } from "@angular/forms";
import { AuthService1 } from "../../app/services/auth.service";
import { MyToastrService } from "../../app/services/toastr.service";
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  AuthService
} from "angularx-social-login";
import { Router } from "@angular/router";
@Component({
  selector: "signup-modal",
  templateUrl: "./signup.component.html"
})
export class SignUpComponent {
  // @ViewChild("modalBox") modalBox;
  // @ViewChild("loginModal") loginModal: LoginComponent;
  // @ViewChild("signupModal") signupModal: SignUpComponent;
  @ViewChild("form") f: NgForm;

  @Output() onClose = new EventEmitter();
  loader = false;
  socialPlatformProvider: any;
  userData = {
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  };
  constructor(
    public modalService: NgbModal,
    private AuthService1: AuthService1,
    private toastrService: MyToastrService,
    private service: AuthService,
    private router: Router,
  ) {}

  // public open() {
  //   this.modalService.open(this.modalBox);
  // }

  closeModal() {
    this.modalService.dismissAll();

    // modal.close();
    // this.onClose.emit();
  }

  openSignInModal() {
    this.modalService.dismissAll("Open login modal");
    this.modalService.open(LoginComponent,{
      backdrop : 'static',
    });
  }
  openSignUpModal() {
    this.modalService.dismissAll("Open login modal");
    // this.signupModal.open();
    this.modalService.open(SignUpComponent, {
      backdrop : 'static',
    });
  }
  onSignUp(f) {
    if (f.form.status == "INVALID") {
      Object.keys(f.controls).forEach(key => {
        f.controls[key].markAsDirty();
      });
      return;
    }
    if( !this.loader ){
      this.loader = true;
      this.AuthService1.onSignUp(this.userData).subscribe(
        (res: any) => {
          this.loader = false;
          if (res.status == 200) {
            this.AuthService1.currentUserLogin.next(res.data);
            localStorage.setItem("currentUser", JSON.stringify(res.data));
            this.AuthService1.currentUser = JSON.parse( localStorage.getItem("currentUser") );
            this.modalService.dismissAll();
            this.toastrService.showToast(res.message, "", "success");
            this.router.navigate(["/"]);
          }
        },
        err => {
          this.loader = false;
          if (err.error.errors) {
            let key = Object.keys(err.error.errors);
            if (key.length > 0) {
              for (let i = 0; i < key.length; i++) {
                this.toastrService.showToast(
                  err.error.errors[key[i]],
                  "",
                  "error"
                );
                return;
              }
            }
          } else {
            this.toastrService.showToast(err.error.message, "", "error");
          }
        }
      );
    }
  }
  socialLogin(type) {
    console.log(type);

    if (type == "gmail") {
      this.socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    } else if (type == "facebook") {
      this.socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    }
    console.log(this.socialPlatformProvider);
    //debugger
    this.service.signIn( this.socialPlatformProvider ).then( (success) => {
      console.log(success);

    }, ( reject ) => {
      console.log(reject);

    });

  }
  // closeSignInModal (){
  //     this.open();

  // }
}
