import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";

const base_url = environment.apiUrl;

@Injectable()
export class CaseLawsService {
  constructor(private httpClient: HttpClient) {}

  getHashTags() {
    return this.httpClient.get(base_url + "hashtags");
  }
  /* Get user-hashtags */
  userHashtags() {
    return this.httpClient.get(base_url + "user-hashtags");
  }

  /* User or Admin topic */
  userAdminHashtags() {
    return this.httpClient.get(base_url + "user-admin-hashtags");
  }

  getSubTopics(item) {
    let params = new HttpParams().set("parent_id", item);
    return this.httpClient.post(base_url + "subtopics",params);
  }

  getSubSubTopics(item) {
    let params = new HttpParams().set("subtopic_id", item);
    return this.httpClient.post(base_url + "usersubsubtopics",params);
  }

  // getSelectedSubTopics(id,topic_id) {
  //  // let params = new HttpParams().set("id", id);
  //  let params = new HttpParams()
  //     .set("id", id)
  //     .set("topic_id", topic_id)
  //   return this.httpClient.get(base_url + "selected-subtopics", {
  //     params: params
  //   });
  // }
  getSelectedSubTopics(id) {
    let params = new HttpParams().set("id", id);
     return this.httpClient.get(base_url + "selected-subtopics", {
       params: params
     });
   }

  getJugementList(search, date, topics, page,per_page) {
    let params = new HttpParams()
      .set("filter[search]", search)
      .set("filter[date]", date)
      .set("filter[topics]", topics)
      .set("page", page)
      .set("per_page", per_page);


    //console.log("url", base_url + "judgements", { params: params });

    return this.httpClient.get(base_url + "judgements", { params: params });
  }

  getListBYJudgeName(name) {
    let params = new HttpParams().set("judge_name", name);
    return this.httpClient.get(base_url + "judgements-by-judge-name", {
      params: params
    });
  }

  getJudgementDetail(id) {
    return this.httpClient.post(base_url + "judgement-detail", id);
  }
}
