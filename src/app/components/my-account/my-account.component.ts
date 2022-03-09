import { Component, OnInit } from "@angular/core";
import { AuthService1 } from "../../services/auth.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "my-account",
  templateUrl: "./my-account.component.html"
})
export class MyAccountComponent implements OnInit {
  updateAccountProcess = false;
  changePasswordProcess = false;
  loader = true;
  userData: any = {};
  passwordData: any = {};
  errors: any = {};

  constructor(private authService: AuthService1, private toastService : ToastrService) {}

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    this.authService.userDetail().subscribe((res: any) => {
      this.loader = false;
      this.userData = res.data;

    }, ( err ) => {
      this.toastService.error( err.message, "Error");
      this.loader = false;
    });
  }

  updateUserData (){
    if( !this.updateAccountProcess ){

      this.errors = {};
      var patt = new RegExp(/^[\w\s]+$/);

      if( !patt.test( this.userData.first_name ) ){
        this.errors['first_name'] = true;
        return false;
      }
      if( !patt.test( this.userData.last_name ) ){
        this.errors['last_name'] = true;
        return false;
      }
      this.updateAccountProcess = true;
      this.authService.updateUserDetail( this.userData ).subscribe( (res : any) => {
        this.toastService.success( res.message, "success");
        var currentUser = JSON.parse ( localStorage.getItem("currentUser") ) ;
        currentUser.data = res.data;
        localStorage.setItem("currentUser", JSON.stringify( currentUser ) );
        this.updateAccountProcess = false;
      }, ( err ) => {
        err = err.error;
        var message = "Something went wrong. Please refresh page and try again."
        if( "errors" in err && err.errors ){
          this.errors = err.errors;
        }
        if( "message" in err && err.message ){
          message = err.message;
        }
        this.toastService.error( message, "Error");
        this.updateAccountProcess = false;
      })
    }

  }

  changePassword (){
    if( !this.changePasswordProcess ){

      this.errors = {};

      if( this.passwordData.password == "" || this.passwordData.password == null ){
        this.errors['password'] = "Required";
        return false;
      }

      if( this.passwordData.new_password == "" || this.passwordData.new_password == null ){
        this.errors['new_password'] = "Required";
        return false;
      }
      if( this.passwordData.new_password.length < 6 ){
        this.errors['new_password'] = "New password must contain at least 6 characters.";
        return false;
      }

      if( this.passwordData.re_new_password == "" || this.passwordData.re_new_password == null ){
        this.errors['re_new_password'] = "Required";
        return false;
      }

      if( this.passwordData.re_new_password !== this.passwordData.new_password  ){
        this.errors['re_new_password'] = "Must match with new password.";
        return false;
      }

      this.changePasswordProcess = true;
      this.authService.changePassword( this.passwordData ).subscribe( (res : any) => {
        this.toastService.success( res.message, "success");

        this.changePasswordProcess = false;
      }, ( err ) => {
        err = err.error;
        var message = "Something went wrong. Please refresh page and try again."
        if( "errors" in err && err.errors ){
          this.errors = err.errors;
        }
        if( "message" in err && err.message ){
          message = err.message;
        }
        this.toastService.error( message, "Error");
        this.changePasswordProcess = false;
      })
    }

  }
}
