import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";

const base_url = environment.apiUrl;

@Injectable()
export class HomeService {
  constructor(private httpClient: HttpClient) {}

  getSlideData() {
    return this.httpClient.get(base_url + "testimonials");
  }

  getTodayDigestList() {
    return this.httpClient.get(base_url + "today-digest");
  }

  getJudgementBySlug(slug,flag,page,per_page) {
    let params = new HttpParams()
    .set("slug", slug)
    .set('flag',flag)
    .set("page", page)
    .set("per_page", per_page)
    return this.httpClient.get(base_url + "category-judgements", {
      params: params
    });
  }

  emailSubscribe(email) {
    return this.httpClient.post(base_url + "subscribe", email);
  }

  emailUnsubscribe(email) {
    return this.httpClient.post(base_url + "unsubscribe", email);
  }

  getaboutData() {
    return this.httpClient.get(base_url + "about-us");
  }
}
