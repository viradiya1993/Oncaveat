import { Component, OnInit, HostListener } from '@angular/core';
import { environment } from "../../../environments/environment";
import { Router, ActivatedRoute } from '@angular/router';
import { MyToastrService } from '../../services/toastr.service';
import { HomeService } from '../../services/home.service';
import { ConfirmDialogService } from '../../../modals/confirm-dialog/confirm-dialog.servicey';
import { CaseLawsService } from '../../services/caselaws.service';
import { CaseBooksService } from '../../services/casebooks.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from '../../services/common.service';
import { AuthService1 } from "../../services/auth.service";
import * as moment from "moment";
import { UpdateSummaryComponent } from '../../../modals/update-summary/update-summary.component';
import { LoginComponent } from '../../../modals/login/login.component';

@Component({
  selector: 'app-subtopic-slug',
  templateUrl: './subtopic-slug.component.html'
})
export class SubtopicSlugComponent implements OnInit {
  searchResult: boolean = false;
  dateFormat: any;
  loader: boolean = false;
  slug: any;
  flag: any;
  slugList: any = {
    data: []
  };
  hashList: any = [];
  date: any;
  topicId: any;
  searchData: any;
  search: any;
  email: any;
  judgeName: any;
  showMobileSearchBar: boolean = false;
  categoryList: any;
  subtopicList: any;
  aboutData: any;
  dataNotFound: boolean = false;
  shareUrl = environment.shareUrl;
  baseUrl: any;
  isActiveTopics: boolean;
  searchTerm: string;
  screenHeight: number;
  screenWidth: number;
  page = 1;
  per_page = 5;
  nextPage: any = null;
  searchtypedata: any;
  subtopicshow: boolean = false;
  searchshow: boolean = false;
  categoryId: any;
  subtopicname: any;

  isLoadAfterReset: boolean = false;
  isLoadBeforeReset: boolean = false;

  judgmentListWithoutBlank: Array<any> = [];
  constructor(
    private router: Router,
    private toastrService: MyToastrService,
    private homeService: HomeService,
    private route: ActivatedRoute,
    public confirmDialog: ConfirmDialogService,
    private caseLawService: CaseLawsService,
    private casebookService: CaseBooksService,
    public modalService: NgbModal,
    public commonService: CommonService,
    private AuthService1: AuthService1) {
    this.slug = route.snapshot.paramMap.get("slug");
    this.flag = route.snapshot.queryParams.flag ? route.snapshot.queryParams.flag : false;
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.onChangeScreenSize();
  }

  ngOnInit() {
    this.subtopicshow = true;
    this.baseUrl = window.location.origin;
    this.searchData = '';
    this.commonService.isHeaderSearchVisible = true;
    this.getJudgermentBySlug();
    this.getHashList();
    this.getAboutData();
  }

  /* GetJudgement Slug List */
  getJudgermentBySlug() {
    if (!this.loader) {
      if (this.isLoadBeforeReset) {
        this.loader = false;
      } else {
        this.loader = true;
      }
      this.homeService.getJudgementBySlug(this.slug, this.flag, this.page, this.per_page).subscribe((res: any) => {
        this.nextPage = res.data.judgments.next_page_url;
        this.loader = false;
        if (!this.isSearchDataEmpty()) {
          this.searchResult = false;
        }
        //this.categoryList = res.data.category;
        this.categoryList = res.data.category.name;
        if (this.flag) {
          this.subtopicList = res.data.SubTopic;
          this.subtopicList.filter(a => this.subtopicname = a.name);
        } else {
          this.subtopicList = [];
        }

        res.data.judgments.data.forEach(court => {
          court.courts.forEach(judegment => {
            judegment.judgements.forEach(data => {
              data["showMore"] = false;
              data["showShare"] = true;
            });
          });
        });


        this.slugList.data = this.slugList.data.concat(res.data.judgments.data);

        if (this.slugList.data.length == 0 && this.isSearchDataEmpty()) {
          this.dataNotFound = true;
        } else {
          this.dataNotFound = false;
        }
      }, (err) => {
        this.loader = false;
      });
    }
  }

  onSearch() {
    if (!this.loader) {
      this.isLoadAfterReset ? this.loader = false : this.loader = true;
      // this.loader = true;
      let dateFormat;
      if (this.date != undefined) {
        var dt = moment(this.date);
        if (dt.isValid()) {
          dateFormat = dt.format("YYYY-MM-DD");
        } else {
          dateFormat = "";
        }
      } else {
        this.dateFormat = "";
      }

      let topicid = this.topicId;

      this.caseLawService
        .getJugementList(
          this.searchData,
          dateFormat,
          topicid,
          this.page,
          this.per_page
        )
        .subscribe((res: any) => {
          console.log(res, 'onserach')
          this.loader = false;
          if (res.data.length) {
            this.nextPage = res.next_page_url;
            if (this.isSearchDataEmpty()) {
              this.searchResult = true;
            } else {
              this.searchResult = false;
            }
            var judgementList = [];

            if (res.data.length && this.isSearchResults()) {
              res.data.forEach(court => {
                court.courts.forEach(judgement => {
                  judgement.judgements.forEach(data => {
                    data["showMore"] = false;
                    data["showShare"] = true;
                    data["created_date"] = court.created_date;
                    data["court_name"] = judgement.court_name;
                  });
                  if (!this.isLoadAfterReset) {
                    judgementList = judgementList.concat(judgement.judgements);
                  } else {
                    this.judgmentListWithoutBlank = this.judgmentListWithoutBlank.concat(judgement.judgements);
                  }
                  // judgementList = judgementList.concat( judgement.judgements );
                });
              });
              if (!this.isLoadAfterReset) {
                res.data = judgementList;
                this.slugList = res;
              } else {
                this.slugList.data = this.slugList.data.concat(this.judgmentListWithoutBlank);
              }
              // res.data = judgementList;
            }
            // this.slugList = res;
            if (!this.isSearchResults()) {
              this.slugList.data.forEach(court => {
                court.courts.forEach(judgement => {
                  judgement.judgements.forEach(data => {
                    data["showMore"] = false;
                    data["showShare"] = true;
                  });
                });
              });
            }
            if (this.slugList.data.length == 0) {
              this.dataNotFound = true;
            } else {
              this.dataNotFound = false;
            }
          } else {
            this.slugList = [];
            this.dataNotFound = true;
          }
        }, (err) => {
          this.loader = false;
        });
    }

  }

  /* onSearchType*/
  onSearchType() {
    if (!this.searchData == false) {
      this.date = "";
      this.topicId = "";
      this.commonService.isSearchOpen = false;
    }
    this.page = 1;

    this.onSearch();
    //this.getJudgermentBySlug();
    this.subtopicshow = false;
    this.searchshow = true;
  }

  /* Keydown search */
  applyFilter() {
    if (!this.searchData == false) {
      this.date = "";
      this.topicId = "";
      this.commonService.isSearchOpen = false;
    }
    //this.searchtypedata = event.target.value;
    // if(!this.searchtypedata == false) {
    //   this.subtopicshow = false;
    //   this.searchshow = true;
    // } else {
    //   this.subtopicshow = true;
    //   this.searchshow = false;
    // }
    this.subtopicshow = false;
    this.onSearch();

  }
  /** resetFilter */

  resetFilter() {
    this.searchData = '';
    this.date = '';
    this.topicId = '';
    this.searchTerm = '';
    this.commonService.isSearchOpen = false;
    this.getJudgermentBySlug();
    this.router.navigate(['/caselaws']);
  }

  /* Search Empty Result */
  isSearchDataEmpty() {
    var dt = moment(this.date);
    return (this.searchData !== undefined || dt.isValid() || this.topicId.length > 0);
  }

  /* Search Result */
  isSearchResults() {
    if (this.isSearchDataEmpty()) {
      return (this.searchResult && this.isSearchDataEmpty());
    }
    return (this.searchResult);
  }

  getHashList() {
    this.caseLawService.getHashTags().subscribe((res: any) => {
      this.hashList = res.data;
    });
  }

  onTopicSelect(value, checker) {
    let url = "/search-topics/" + value
    this.router.navigate([url], { queryParams: { flag: checker } });
    this.commonService.isSearchOpen = false;
    // if (id != this.topicId) {
    //   this.topicId = id;
    //   this.commonService.isSearchOpen = false;
    //   window.scrollTo(0, 0)
    // } else {
    //   this.topicId = ""
    //   this.commonService.isSearchOpen = false;
    //   window.scrollTo(0, 0)
    // }
    // this.searchData = "";
    // this.date = "";
    // this.onSearch();
  }

  onDateChange(date) {
    if (date) {
      this.commonService.isSearchOpen = false;
      this.subtopicshow = false;
    }
    this.topicId = "";
    this.searchData = "";
    this.searchTerm = "";
    this.onSearch();
  }

  clearDate(date) {
    this.searchData = '';
    this.date = '';
    this.topicId = '';
    this.searchTerm = '';
    this.commonService.isSearchOpen = false;
    this.router.navigate(['/caselaws']);
  }

  onJudgeNameClick(judgeName) {
    this.router.navigate(["caselaws"], {
      queryParams: { judgeName: judgeName }
    });
  }

  onSlugClick(value, checker) {
    let url = "/topics/" + value
    this.router.navigate([url], { queryParams: { flag: checker } });
    this.homeService.getJudgementBySlug(value, checker, this.page, this.per_page).subscribe((res: any) => {
      this.nextPage = res.data.judgments.next_page_url;
      this.categoryList = res.data.category.name;
      if (checker) {
        this.subtopicList = res.data.SubTopic;
        this.subtopicList.filter(a => this.subtopicname = a.name);
      } else {
        this.subtopicList = [];
      }

      res.data.judgments.data.forEach(court => {
        court.courts.forEach(judegment => {
          judegment.judgements.forEach(data => {
            data["showMore"] = false;
            data["showShare"] = true;
          });
        });
      });
      this.slugList.data = res.data.judgments.data;
      if (this.slugList.data.length == 0) {
        this.dataNotFound = true;
      } else {
        this.dataNotFound = false;
      }
    });
  }

  onSubtopicSlug(value, checker) {
    let url = "/sub-topic/" + value
    this.router.navigate([url], { queryParams: { flag: checker } });
    this.homeService.getJudgementBySlug(value, checker, this.page, this.per_page).subscribe((res: any) => {
      this.nextPage = res.data.judgments.next_page_url;
      this.categoryList = res.data.category.name;
      if (checker) {
        this.subtopicList = res.data.SubTopic;
        this.subtopicList.filter(a => this.subtopicname = a.name);
      } else {
        this.subtopicList = [];
      }
      res.data.judgments.data.forEach(court => {
        court.courts.forEach(judegment => {
          judegment.judgements.forEach(data => {
            data["showMore"] = false;
            data["showShare"] = true;
          });
        });
      });
      this.slugList.data = res.data.judgments.data;
      if (this.slugList.data.length == 0) {
        this.dataNotFound = true;
      } else {
        this.dataNotFound = false;
      }
    });
  }

  onSubscribe() {
    this.homeService.emailSubscribe({ email: this.email }).subscribe(
      (res: any) => {
        if (res.status === 200) {
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

  onSave(data, i, j, k) {
    if (this.AuthService1.isAuthenticated()) {
      this.modalService.dismissAll("Open login modal");
      const modal = this.modalService.open(UpdateSummaryComponent, {
        backdrop: "static",
        windowClass: "update-summary-wrap"
      });
      modal.componentInstance.dataUpdate = data;
      // Get Modal result when save is complete
      modal.result.then((result) => {
        if (result) {
          // Set saved to resave in judgment array.
          this.slugList.data[i].courts[j].judgements[k].is_saved = true;
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
              //judgement.loader = true;
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
        .confirm("Unsave !", "Are you sure you want to unsave the judement ?")
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

  onLoadData() {
    this.page = this.page + 1;
    this.searchData ? this.isLoadAfterReset = true : this.isLoadBeforeReset = true;
    this.searchData ? this.onSearch() : this.getJudgermentBySlug();
    // this.getJudgermentBySlug(); 
  }

  onSearchIconClick() {
    this.showMobileSearchBar = !this.showMobileSearchBar;
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

  updateSearch(e) {
    this.searchTerm = e.target.value
  }

  onShareClick(data) {
    data.showShare = !data.showShare;
  }

  getAboutData() {
    this.homeService.getaboutData().subscribe((res: any) => {
      this.aboutData = res.data;
    });
  }

  /* Read More */
  onReadMore(data) {
    data.showMore = !data.showMore;
  }

  /* Second heading read more*/
  onReadMoresub(data) {
    data.showMore = !data.showMore;
  }

  onChangeScreenSize() {
    for (let index = 0; index < this.slugList.data.length; index++) {
      const element = this.slugList.data[index];
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
