import { Component, ViewChild, Output, EventEmitter, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgForm } from "@angular/forms";
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  AuthService
} from "angularx-social-login";

import { SignUpComponent } from "../signup/signup.component";
import { ForgotPasswordComponent } from "../forgot-password/forgot-password.component";
import { AuthService1 } from "../../app/services/auth.service";
import { Router } from "@angular/router";
import { MyToastrService } from "../../app/services/toastr.service";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { RandStringService } from "../../app/services/random-string.service";

import { TwitterService } from "./twitter.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "login-modal",
  templateUrl: "./login.component.html"
})
export class LoginComponent implements OnInit {
  // @ViewChild("modalBox") modalBox;
  // @ViewChild("signupModal") signupModal: SignUpComponent;

  @ViewChild("form") f: NgForm;
  @Output() onClose = new EventEmitter();
  openSignUp: boolean = false;
  signInData = {
    email: "",
    password: ""
  };
  isVerifed: boolean = true;
  loader = false;
  oauthNonce : any;
  socialLoginLoader = false;
  resendEmail: any;
  socialPlatformProvider: any;
  twitterError: any;
  checktoster:any=true;
  constructor(
    public modalService: NgbModal,
    private AuthService1: AuthService1,
    private router: Router,
    private randomStringSErvice: RandStringService,
    private httpClient: HttpClient,
    private toastrService: MyToastrService,
    private service: AuthService,
    private twitterService: TwitterService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit (){
    this.oauthNonce = this.randomStringSErvice.randomString(32);
    this.service.authState.subscribe(user => {
      if( user && !this.socialLoginLoader){
        this.socialLoginLoader =true;
        if(this.checktoster){
          this.toastrService.toastr.success("Welcome to Oncaveat. Start Saving", "Success !");
          this.checktoster=false;
        }
        this.AuthService1.onSocialLogin( user ).subscribe(
            ( res:any ) => {
              this.socialLoginLoader = false;
              this.AuthService1.setLoginData(res);
              this.AuthService1.currentUserLogin.next(res);
              if(this.router.url === '/') {
                this.router.navigate(["/"]);
              } else if (this.router.url === '/caselaws') {
                this.router.navigate(["/caselaws"]);
              }
              //this.toastrService.toastr.success( res.message, "Success !");
              //this.router.navigate(["/home"]);
              this.modalService.dismissAll();
              this.service.signOut();
            },
            ( err ) => {
              this.socialLoginLoader =false;
              err = err.error;
              var msg = "Something went wrong !";
              if( "message" in err && err.message ){
                msg = err.message;
              }
              this.toastrService.toastr.error( msg, "Error !");
            }
        )
      }



    });
  }
  // public open() {
  //   this.modalService.open(this.modalBox);
  // }

  closeModal() {
    this.modalService.dismissAll();
    // modal.close();
    // this.onClose.emit();
  }

  onSignIn(f) {
    if (f.form.status == "INVALID") {
      Object.keys(f.controls).forEach(key => {
        f.controls[key].markAsDirty();
      });
      return;
    }
    if (!this.loader) {
      this.loader = true;
      this.AuthService1.onLogin(this.signInData).subscribe(
        (res: any) => {
          this.loader = false;
          if (res && res.token) {
            this.isVerifed = true;
            this.AuthService1.currentUserLogin.next(res);
            localStorage.setItem("currentUser", JSON.stringify(res));
            this.AuthService1.currentUser = JSON.parse(
              localStorage.getItem("currentUser")
            );
            this.modalService.dismissAll();
            this.toastrService.showToast(res.message, "", "success");
            if(this.router.url === '/') {
              this.router.navigate(["/"]);
            } else if (this.router.url === '/caselaws') {
              this.router.navigate(["/caselaws"]);
            }
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
            // this.isVerifed = false;
          }
          // if (err.status === 401) {
          //   this.toastrService.showToast(err.error.message, "", "error");
          // }
        }
      );
    }
  }

  onResend(f) {
    if (f.invalid) {
      return;
    }
    this.AuthService1.resendLink({ email: this.resendEmail }).subscribe(
      (res: any) => {
        this.toastrService.showToast(res.message, "", "success");
      },
      err => {
        this.toastrService.showToast(err.error.message, "", "error");
      }
    );
  }

  openSignUpModal() {
    this.modalService.dismissAll("Open login modal");
    this.modalService.open(SignUpComponent, {
      backdrop: "static"
    });
  }

  openForgotPasswordModal() {
    this.modalService.dismissAll("Open login modal");
    this.modalService.open(ForgotPasswordComponent, {
      backdrop: "static"
    });
  }

  socialLogin(type) {
    if (type == 'gmail') {
      this.socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    } else if (type == 'facebook') {
      this.socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    }
    this.service.signIn( this.socialPlatformProvider ).then( (success) => {
      console.log(success);
    }, ( reject ) => {
      console.log(reject);
    });

  }

  twitterLogin () {
    var twitterPopup = window.open( environment.backendUrl + "auth/twitter",  "twitter-login", "height=500,width=516");

    window.onmessage = function( e ){
      console.log( "Twitter callback event" );
      console.log( e );

    }

    twitterPopup.onunload = function ( e ){
      console.log( twitterPopup.opener );
     // console.log( window.userData );
      console.log( "HERE" );

    }
      // let tempStr:string;
      // this.twitterService.onSignIn().then(function (response) {
      //   tempStr = response["_body"];
      //   let a = tempStr.indexOf("&");
      //   let token = tempStr.substr(0,a);
      //   window.location.href = "https://api.twitter.com/oauth/authenticate?"+token;
      // }).catch((error) => {
      //   if(error === "Http failure response for (unknown url): 0 Unknown Error") {
      //     this.toastrService.toastr.error( "Try again later after sometime.", "Error !");
      //   }
      // });

    // var headers = {
    //   "Authorization" : 'OAuth oauth_nonce="' + this.oauthNonce + '"' +
    //     ', oauth_callback="http%3A//localhost%3A4200/%23/twitter/process_callback", ' +
    //     'oauth_signature_method="HMAC-SHA1", ' +
    //     'oauth_timestamp="'+ Math.floor( new Date().getTime() / 1000 ) + '"' +
    //     ', oauth_consumer_key="' + environment.twitter_secret_key + '"' +
    //     ', oauth_signature="' + environment.twitter_access_token + '"' +
    //     ', oauth_version="1.0"'
    // }
    // console.log("000000000", headers)
    // this.httpClient.post(
    //     "https://api.twitter.com/oauth/request_token",
    //     {
    //       headers : headers
    //     }
    // ).subscribe( (res) =>{
    //   console.log(res);

    // }, ( err ) => {
    //   console.log(err);

    // })
    // window.open("https://api.twitter.com/oauth/authorize?oauth_token=" + environment.twitter_secret_key,  "twitter-login", "height=500,width=516");

  }
  // signInWithGoogle(): void {
  //   console.log('google login')
  //   this.service.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }

  // signInWithFB(): void {
  //   console.log('facebook login')
  //   this.service.signIn(FacebookLoginProvider.PROVIDER_ID);
  // }
}
