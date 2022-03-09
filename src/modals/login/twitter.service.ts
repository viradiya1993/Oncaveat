import {Injectable, OnInit} from '@angular/core';
import {Headers, RequestOptions, URLSearchParams} from '@angular/http';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';

const CONSUMER_KEY = environment.twitter_key;
const CONSUMER_SECRET = environment.twitter_secret_key;

@Injectable()   
export class TwitterService {

  public data:JSON;
  public allData:string;
  public token:string;
  public verifier:string;
  public trends;
  public suggestedUsers;
  public tweeted;
  public userInfo;
  public arrOfPosts:Array<object>;
  public loadCount = 1;
  // URL to web api
  constructor(private http: HttpClient) {
    // console.log(CONSUMER_KEY);
  }

  static randomElement(arr):any{
    return arr[Math.floor(Math.random()*arr.length)];
  }

  static getQueryParamsFromUrl(url: string): Array<Object> {
    var quesInd = url.indexOf('?');
    if (quesInd == -1)return [];
    var arr = url.substr(quesInd + 1).split('&');
    var newArr = [];
    arr.forEach(function (item) {
      var u = {};
      var t = item.split('=');
      u['key'] = t[0];
      u['value'] = t[1];
      newArr.push(u);
    });
    // console.log("This is my Query Array", newArr);
    return newArr;
  }

  onSignIn(): Promise<any> {
    let twitterCallbackUrl = 'http://localhost:4200/callback';
    let url = "https://api.twitter.com/oauth/request_token";
    let method = "POST";
    let oauth_consumer_key = CONSUMER_KEY;
    let oauth_nonce = TwitterService.getNonce(32);
    let oauth_signature_method = "HMAC-SHA1";
    let oauth_timestamp = Math.floor(Date.now() / 1000).toString();
    let oauth_version = "1.0";
    let parameterString = TwitterService.getSignatureString([
      {key: "oauth_callback", value: twitterCallbackUrl},
      {key: "oauth_consumer_key", value: oauth_consumer_key},
      {key: "oauth_nonce", value: oauth_nonce},
      {key: "oauth_signature_method", value: "HMAC-SHA1"},
      {key: "oauth_timestamp", value: oauth_timestamp},
      {key: "oauth_version", value: "1.0"},
    ]);


    let shaKey = encodeURIComponent(CONSUMER_SECRET) + "&"; //Consumer Key Secret
    let final_string = method + "&" + encodeURIComponent(url) + "&" + encodeURIComponent(parameterString);
    // console.log("Parameter String:", parameterString);
    // console.log("finalString:", final_string);
    // console.log("shakey:", shaKey);
    let s = hmacSHA512(final_string, shaKey);
    let oauth_signature = Base64.stringify(s);
    // console.log(oauth_signature);
    let authValue = TwitterService.getAuthValue([
      {key: "oauth_callback", value: twitterCallbackUrl},
      {key: "oauth_consumer_key", value: oauth_consumer_key},
      {key: "oauth_nonce", value: oauth_nonce},
      {key: "oauth_signature", value: oauth_signature},
      {key: "oauth_signature_method", value: "HMAC-SHA1"},
      {key: "oauth_timestamp", value: oauth_timestamp},
      {key: "oauth_version", value: "1.0"},
    ]);

    let headers = {'Authorization': authValue};
    //console.log(authValue,url);
    //console.log(http);
    //console.log(oauth_nonce.length);
    return this.http.post(url, '', {headers: headers}).toPromise()
      .then(response => response)
      .catch(TwitterService.handleError);
  }

  getAccessToken(): Promise<any> {
    let url = "https://api.twitter.com/oauth/access_token";
    let method = "POST";
    let oauth_consumer_key = CONSUMER_KEY;
    let oauth_nonce = TwitterService.getNonce(32);
    let oauth_signature_method = "HMAC-SHA1";
    let oauth_timestamp = Math.floor(Date.now() / 1000).toString();
    let oauth_version = "1.0";
    let parameterString = TwitterService.getSignatureString([
      {key: "oauth_consumer_key", value: oauth_consumer_key},
      {key: "oauth_nonce", value: oauth_nonce},
      {key: "oauth_signature_method", value: "HMAC-SHA1"},
      {key: "oauth_timestamp", value: oauth_timestamp},
      {key: "oauth_token", value: this.token},
      {key: "oauth_verifier", value: this.verifier},
      {key: "oauth_version", value: "1.0"},
    ]);

    let shaKey = encodeURIComponent(CONSUMER_SECRET) + "&"; //Consumer Key Secret
    let final_string = method + "&" + encodeURIComponent(url) + "&" + encodeURIComponent(parameterString);
    // console.log("Parameter String:", parameterString);
    // console.log("finalString:", final_string);
    // console.log("shakey:", shaKey);
    let s = hmacSHA512(final_string, shaKey);
    let oauth_signature = Base64.stringify(s);
    // console.log(oauth_signature);
    let authValue = TwitterService.getAuthValue([
      {key: "oauth_consumer_key", value: oauth_consumer_key},
      {key: "oauth_nonce", value: oauth_nonce},
      {key: "oauth_signature", value: oauth_signature},
      {key: "oauth_signature_method", value: "HMAC-SHA1"},
      {key: "oauth_timestamp", value: oauth_timestamp},
      {key: "oauth_token", value: this.token},
      {key: "oauth_verifier", value: this.verifier},
      {key: "oauth_version", value: "1.0"},
    ]);

    let headers = {'Authorization': authValue};
    //console.log(authValue,url);
    //console.log(http);
    //console.log(oauth_nonce.length);
    let resArray = [];
    return this.http.post(url, '', {headers: headers}).toPromise()
      .then((response) => response)
      .catch(TwitterService.handleError);
  }


  //any used here is an Object of format {key,value}
  static getSignatureString(arr: Array<any>): string {
    var result = "";
    let l = arr.length;
    for (let i: number = 0; i < l; i++) {
    //   console.log(arr[i].key, arr[i].value);
      result += encodeURIComponent(arr[i].key) + '=' + encodeURIComponent(arr[i].value);
      if (i != l - 1) {
        result += '&';
      }
    }
    return result;
  }

  static getAuthValue(arr: Array<any>): string {
    var result = "OAuth ";
    let l = arr.length;
    for (let i: number = 0; i < l; i++) {
      result += encodeURIComponent(arr[i].key) + '="' + encodeURIComponent(arr[i].value) + '"';
      if (i != l - 1) {
        result += ', ';
      }
    }
    return result;
  }

  static getNonce(numChars): string {
    var st = "0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz";
    var l = st.length;
    var result = "";

    for (var i = 0; i < numChars; i++) {
      var randomIndex = Math.floor(Math.random() * l);
      result = result + st.charAt(randomIndex);
    }
    return result;
  }

  static saveToken(response: any) {
    let temp = response["_body"];
    let iA = temp.indexOf('&');
    return temp.substr(0, iA);
  }

  static handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  public saveTokenVerifier(token:string,verifier:string):void{
    this.token=token;
    this.verifier=verifier;
  }
}