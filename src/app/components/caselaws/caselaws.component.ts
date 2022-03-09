import { Component, OnInit, OnChanges, SimpleChange, SimpleChanges, ElementRef, ViewChild, DoCheck, HostListener } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import * as moment from "moment";

import { MyToastrService } from "../../services/toastr.service";
import { CaseLawsService } from "../../services/caselaws.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UpdateSummaryComponent } from "../../../modals/update-summary/update-summary.component";
import { HomeService } from "../../services/home.service";
import { LoginComponent } from "../../../modals/login/login.component";
import { AuthService1 } from "../../services/auth.service";
import { environment } from "../../../environments/environment";
import { CommonService } from "../../services/common.service";
import { CaseBooksService } from "../../services/casebooks.service";
import { BoradcastService } from "../../services/broadcast.service";
import { ConfirmDialogService } from "../../../modals/confirm-dialog/confirm-dialog.servicey";
import { Calendar } from "primeng/calendar";
import { Observable } from "rxjs";

@Component({
  selector: "app-caselaws",
  templateUrl: "./caselaws.component.html"
})

export class CaseLawsComponent implements OnInit {
  searchResult: boolean = false;
  loader: boolean = false;
  searchOnLoadEmpty: boolean = true
  date: any;
  hashList: any;
  judgementList: any = [];
  topicId: any;
  searchData: any;
  search: any;
  email: any;
  judgeName: any;
  searchClick: boolean = false;
  dateFormat: any;
  topicid: any;
  showMobileSearchBar: boolean = false;
  aboutData: any;
  dataNotFound: boolean = false;
  searchDataNotFound: boolean = false;
  shareUrl = environment.shareUrl;
  baseUrl: any;
  isActiveTopics: boolean;
  searchTerm: string;
  screenHeight: number;
  screenWidth: number;
  page = 1;
  per_page = 5;
  nextPage: any;
  prevpage: any;
  subheading: Object[] = [];
  mySubscription: any;
  judegmentId: any

  isLoadAfterReset: boolean = false;
  constructor(
    private router: Router,
    private toastrService: MyToastrService,
    private caseLawService: CaseLawsService,
    private casebookService: CaseBooksService,
    public modalService: NgbModal,
    public commonService: CommonService,
    public confirmDialog: ConfirmDialogService,
    private homeService: HomeService,
    private route: ActivatedRoute,
    private AuthService1: AuthService1,
  ) { }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.onChangeScreenSize();
  }


  ngOnInit() {
    this.baseUrl = window.location.origin;
    setTimeout(() => {
      this.commonService.isHeaderSearchVisible = true;
    }, 170);
    this.searchData = '';
    this.judgeName = this.route.snapshot.queryParamMap.get("judgeName");
    this.search = this.route.snapshot.queryParamMap.get("searchData");
    if (this.judgeName != null) {
      this.onJudgeNameClick(this.judgeName);
    } else if (this.search != null) {
      this.searchData = this.search;
      this.onSearch();
    } else {
      this.searchData = "";
      this.getJudgementList();
    }
    this.getHashList();
    this.getAboutData();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      // window.scrollTo(0, 0)
    });

  }


  getHashList() {
    this.caseLawService.getHashTags().subscribe((res: any) => {
      this.hashList = res.data;
    });
  }

  getAboutData() {
    this.homeService.getaboutData().subscribe((res: any) => {
      this.aboutData = res.data;
    });
  }

  /* GetJugementList */
  getJudgementList() {
    if (!this.loader) {
      this.loader = true;
      let topicid = "";
      let dateFormat = "";
      this.caseLawService
        .getJugementList('', '', '', this.page, this.per_page)
        .subscribe((res: any) => {
          this.nextPage = res.next_page_url;
          this.prevpage = res.prev_page_url;
          this.loader = false;
          if (!this.isSearchDataEmpty()) {
            this.searchResult = false; // Default
          }
          res.data.forEach(court => {
            court.courts.forEach(judgement => {
              judgement.judgements.forEach(data => {
                data["showMore"] = false;
                data["showShare"] = true;
              });
            });
          });
          this.judgementList = this.judgementList.concat(res.data);
          if (this.judgementList.length == 0 && this.isSearchDataEmpty()) {
            this.dataNotFound = true
          } else {
            this.dataNotFound = false;
          }
        }, (err) => {
          this.loader = false;
        });
    }
  }

  /* New Search */
  onSearch() {
    if (!this.loader) {
      // this.page = 1;
      this.loader = true;
      this.searchClick = true;
      if (this.date != undefined) {
        var dt = moment(this.date);
        if (dt.isValid()) {
          this.dateFormat = dt.format("YYYY-MM-DD");
        } else {
          this.dateFormat = "";
        }
      } else {
        this.dateFormat = "";
      }

      this.caseLawService
        .getJugementList(
          this.searchData,
          this.dateFormat,
          this.topicId,
          this.page,
          this.per_page
        )
        .subscribe((res: any) => {
          this.loader = false;
          if (res.data.length) {

            this.nextPage = res.next_page_url;
            if (!this.isSearchDataEmpty()) {
              this.searchResult = false;
            }
            console.log(this.searchResult && this.isSearchDataEmpty());
            console.log(this.isSearchResults());
            if (res.data.length) {

              if (!this.isLoadAfterReset) {
                var judgementListSearch: any = [];
              }
              res.data.forEach(court => {
                court.courts.forEach(judgement => {
                  judgement.judgements.forEach(data => {
                    data["showMore"] = false;
                    data["showShare"] = true;
                    data["created_date"] = court.created_date;
                    data["court_name"] = judgement.court_name;
                  });
                  if (!this.isLoadAfterReset) {
                    judgementListSearch = judgementListSearch.concat(judgement.judgements);
                  }
                });
              });
            }
            if (!this.isLoadAfterReset) {
              this.judgementList = res.data;
            } else {
              this.judgementList = this.judgementList.concat(res.data);

            }

            if (!this.isSearchResults()) {
              this.judgementList.forEach(court => {
                court.courts.forEach(judgement => {
                  judgement.judgements.forEach(data => {
                    data["showMore"] = false;
                    data["showShare"] = true;
                  });
                });
              });
            }
            if (this.judgementList.length == 0) {
              this.dataNotFound = true
            } else {
              this.dataNotFound = false
            }
          } else {
            this.judgementList = [];
            this.dataNotFound = true;
          }
        }, (err) => {
          this.loader = false;
        });
    }
  }

  /* Search Empty Result */
  isSearchDataEmpty() {
    var dt = moment(this.dateFormat);
    return (this.searchData !== "" || dt.isValid() || this.topicId.length > 0);
  }

  /* Search Result */
  isSearchResults() {
    if (this.isSearchDataEmpty()) {
      return (this.searchResult && this.isSearchDataEmpty());
    }
    return (this.searchResult);

  }

  /* Read More */
  onReadMore(data) {
    data.showMore = !data.showMore;
  }

  onDateChange(date) {
    this.commonService.isSearchOpen = false;
    this.topicId = "";
    this.searchData = "";
    this.searchTerm = "";
    this.onSearch();
  }

  onViewredirectDetail(id) {
    if (id) {
      window.open(id, "_blank");
    }
  }

  onViewDetail(id) {
    localStorage.setItem("judgementId", id);
    this.AuthService1.judegmentId.next(id);
  }



  onTopicSelect(value, checker) {
    let url = "/search-topics/" + value
    this.router.navigate([url], { queryParams: { flag: checker } });
    this.commonService.isSearchOpen = false;
  }


  /* Search type */
  onSearchType() {
    if (!this.searchData == false) {
      this.date = "";
      this.topicId = "";
      this.commonService.isSearchOpen = false;
    }
    this.page = 1;
    this.onSearch();
  }

  /* Reset Filter*/
  resetFilter() {
    this.searchData = '';
    this.date = "";
    this.topicId = "";
    this.searchTerm = "";
    this.searchDataNotFound = false;
    this.dataNotFound = false;
    this.commonService.isSearchOpen = false;
    this.getJudgementList();
  }

  updateSearch(e) {
    this.searchTerm = e.target.value
  }

  onJudgeNameClick(judgeName) {
    this.caseLawService.getListBYJudgeName(judgeName).subscribe((res: any) => {
      this.judgementList = res.data.data;
    });
  }

  /* Topic select slug */
  onSlugClick(value, checker) {
    let url = "/topics/" + value
    this.router.navigate([url], { queryParams: { flag: checker } });
  }

  /*onSubtopicSlug */
  onSubtopicSlug(value, checker) {
    let url = "/sub-topic/" + value
    this.router.navigate([url], { queryParams: { flag: checker } });
  }

  onSave = (data, i, j, k) => {
    if (this.AuthService1.isAuthenticated()) {
      this.modalService.dismissAll("Open login modal");
      const modal = this.modalService.open(UpdateSummaryComponent, {
        windowClass: "update-summary-wrap"
      });
      modal.componentInstance.dataUpdate = data;
      // Get Modal result when save is complete
      modal.result.then((result) => {
        if (result) {
          // Set saved to resave in judgment array.
          this.judgementList[i].courts[j].judgements[k].is_saved = true;
        }
      });
    } else {
      this.modalService.dismissAll("Open login modal");
      this.modalService.open(LoginComponent, {
        backdrop: "static"
      });
    }
  }

  onSaveAgain(judgement) {
    if (judgement.is_saved) {
      this.confirmDialog
        .confirm("", "You seem to have saved this judgment before.  Would you like to save again under a new topic?")
        .then(
          (confirmed) => {
            if (confirmed) {
              // judgement.loader = true;
              this.onSave(judgement, '', '', '');
            } else {
              console.log('no')
            }
          }
        ).catch(
          (reason: any) => {

          }
        );
    }
  }

  unsaveJudgement(judgement) {
    if (judgement.is_saved && !judgement.loader) {
      this.confirmDialog
        .confirm("Unsave !", "Are you sure you want to unsave the judgement ?")
        .then(
          (confirmed) => {
            if (confirmed) {
              judgement.loader = true;
              var data = {
                judgement_id: judgement.id
              };
              this.casebookService.removeCasebook(data).subscribe(
                (res: any) => {
                  judgement.loader = false;
                  judgement.is_saved = false;
                  var message = "Selected judgment removed success";
                  if (res.message) {
                    message = res.message;
                  }
                  this.toastrService.toastr.success(message, 'Success !');
                },
                (err) => {
                  err = err.error;
                  judgement.loader = false;
                  var message = "Something went wrong. Please refresh page and try again.";
                  if (err.message) {
                    message = err.message;
                  }
                  this.toastrService.toastr.error(message, 'Error !');
                }
              )
            }
          }
        ).catch(
          (reason: any) => {

          }
        );
    }
  }


  onSubscribe() {
    this.homeService.emailSubscribe({ email: this.email }).subscribe(
      (res: any) => {
        if (res.status === 200) {
          this.email = '';
          localStorage.setItem("currentUser", JSON.stringify(res));
          this.toastrService.showToast(res.message, "", "success");
        }
      },
      err => {
        if (err.status === 401) {
          this.toastrService.showToast(err.error.message, "", "error");
        }
      }
    );
  }

  onLoadData() {
    this.loader = false;

    this.page = this.page + 1;
    this.searchData ? this.isLoadAfterReset = true : this.isLoadAfterReset = false;
    this.searchData ? this.onSearch() : this.getJudgementList();
  }

  onSearchIconClick() {
    //this.showMobileSearchBar = !this.showMobileSearchBar;
  }

  onShareClick(data) {
    data.showShare = !data.showShare;
  }

  onChangeScreenSize() {
    for (let index = 0; index < this.judgementList.length; index++) {
      const element = this.judgementList[index];

      for (let i = 0; i < element.courts.length; i++) {
        const elem = element.courts[i];

        for (let j = 0; j < elem.judgements.length; j++) {
          const el = elem.judgements[j];

          if (this.screenWidth <= 576) {
            el.showShare = !el.showShare;
          } else {
            el.showShare = el.showShare;
          }
        }
      }
    }
  }
}
