import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

const base_url = environment.apiUrl;

@Injectable()
export class CaseBooksService {
  constructor(private httpClient: HttpClient) {}

  createCasebook(data) {
    return this.httpClient.post(base_url + "casebook/create", data);
  }

  removeCasebook(data) {
    return this.httpClient.post(base_url + "casebook/remove", data);
  }

  updateCasebook(data) {
    return this.httpClient.post(base_url + "casebook/update", data);
  }

  updateSubTopic(data) {
    return this.httpClient.post(base_url + "casebook/change-sub-topic", data);
  }

  updateTopic(data) {
    return this.httpClient.post(base_url + "casebook/category-user-specific", data);
  }

  updateCasebookDescription(data) {
    return this.httpClient.post(base_url + "casebook/update-note", data);
  }

  getCasbookList(id) {
    //return this.httpClient.post(base_url + "casebook/list", id);
    return this.httpClient.post(base_url + "casebook/case-list", id);

  }

  /* Topics Subtopics list API */
  getSubtopic(id) {
    return this.httpClient.post(base_url + "casebook/get-topic-subtopics", id);
  }
  userCategories() {
    return this.httpClient.get(base_url + "user/saved-categories");
  }
}
