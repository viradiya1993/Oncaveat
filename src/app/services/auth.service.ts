import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

const base_url = environment.apiUrl;

@Injectable()
export class AuthService1 {

  currentUser: any;
  currentUserLogin: Subject<any> = new Subject();
  judegmentId: Subject<any> = new Subject();
  constructor(private httpClient: HttpClient) {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.getUserData();
  }

  onLogin(userData) {
    return this.httpClient.post(base_url + "login", userData);
  }

  onSocialLogin(data) {
    return this.httpClient.post(base_url + "social-login", data);
  }

  setLoginData ( res ){
    localStorage.setItem("currentUser", JSON.stringify(res));
    this.currentUser = JSON.parse(
      localStorage.getItem("currentUser")
    );
  }

  getUserData (){
    if( this.getUserLocalStorage() !== null ){

      this.httpClient
          .post(base_url + "user", null)
          .subscribe( ( res ) => {

            }, ( err ) => {
              this.currentUser = null;
              this.removeUserLocalStorage();
            })
    }
  }

  getUserLocalStorage () {
    return localStorage.getItem("currentUser");
  }

  removeUserLocalStorage () {
    return localStorage.removeItem("currentUser");
  }
  
  isAuthenticated() {
    if (this.currentUser) {
      let token = this.currentUser["token"];
      if (token && token != null) {
        return token;
      } else {
        return null;
      }
    }

    return null;
  }

  onSignUp(userData) {
    return this.httpClient.post(base_url + "register", userData);
  }

  verifyUser(token) {
    return this.httpClient.post(base_url + "verify-user", token);
  }

  resendLink(email) {
    return this.httpClient.post(base_url + "send-verification-mail", email);
  }

  forgotPassword(email) {
    return this.httpClient.post(base_url + "forgot-password", email);
  }

  resetPassword(data) {
    return this.httpClient.post(base_url + "reset-password", data);
  }

  changePassword(data) {
    return this.httpClient.post(base_url + "change-password", data);
  }

  userDetail() {
    return this.httpClient.post(base_url + "user", null);
  }

  updateUserDetail( data ) {
    return this.httpClient.post(base_url + "update-user", data);
  }

  logout() {
    return this.httpClient.post(base_url + "logout", null);
  }

}
