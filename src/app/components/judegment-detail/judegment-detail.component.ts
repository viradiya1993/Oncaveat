import { Component, HostListener, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService1 } from "../../services/auth.service";
import { MyToastrService } from "../../services/toastr.service";
import { CaseLawsService } from "../../services/caselaws.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UpdateSummaryComponent } from "../../../modals/update-summary/update-summary.component";
import { LoginComponent } from "../../../modals/login/login.component";
import { environment } from "../../../environments/environment";
import { CommonService } from "../../services/common.service";
import { CaseBooksService } from "../../services/casebooks.service";
import { ConfirmDialogService } from "../../../modals/confirm-dialog/confirm-dialog.servicey";
import { HomeService } from "../../services/home.service";
import { Title, Meta } from '@angular/platform-browser';



@Component({
  selector: "app-judegment-detail",
  templateUrl: "./judegment-detail.component.html"
})

export class JudegMentDetailComponent implements OnInit {
  judgeId: any;
  judgementDetail: any;
  shareUrl = environment.shareUrl;
  email: any;
  baseUrl: any;
  showShare = true;
  screenHeight: number;
  screenWidth: number;
  slug: any;
  flag: any;
  slugList: any = {
    data: []
  };
  dataNotFound: boolean = false;
  subtopicList: any;
  categoryList: any;
  constructor(
    private router: Router,
    private toastrService: MyToastrService,
    private caseLawService: CaseLawsService,
    private casebookService: CaseBooksService,
    private route: ActivatedRoute,
    public confirmDialog: ConfirmDialogService,
    public modalService: NgbModal,
    public commonService: CommonService,
    private AuthService1: AuthService1,
    private homeService: HomeService,
    private titleService: Title,
    private meta: Meta
  ) {
    this.judgeId = this.route.snapshot.paramMap.get("id");
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
    this.baseUrl = window.location.origin;
    this.getJudgementDetail();
  }

  getJudgementDetail() {
    this.caseLawService.getJudgementDetail({ id: this.judgeId }).subscribe(
      (res: any) => {
        this.judgementDetail = res.data;
        console.log(this.judgementDetail.sub_topic, 'j sub')
        this.meta.addTag({ property: 'og:title', content: this.judgementDetail.sub_topic });
        this.meta.updateTag({ property: 'og:title', content: this.judgementDetail.sub_topic })
        this.meta.updateTag({ property: 'og:description', content: this.judgementDetail.sub_topic })

        this.meta.addTag({ property: 'twitter:title', content: this.judgementDetail.sub_topic });
        this.meta.updateTag({ property: 'twitter:title', content: this.judgementDetail.sub_topic })
        this.meta.updateTag({ property: 'twitter:description', content: this.judgementDetail.sub_topic })

      },
      err => {
        this.toastrService.showToast(err.error.message, "", "error");
      }
    );
  }

  onJudgeNameClick(name) {
    this.router.navigate(["caselaws"], { queryParams: { judgeName: name } });
  }


  onSlugClick(value, checker) {
    let url = "/topics/" + value
    this.router.navigate([url], { queryParams: { flag: checker } });
  }

  onSubtopicSlug(value, checker) {
    let url = "/sub-topic/" + value
    this.router.navigate([url], { queryParams: { flag: checker } });
  }

  onSave() {
    if (this.AuthService1.isAuthenticated()) {
      this.modalService.dismissAll("Open login modal");
      const modal = this.modalService.open(UpdateSummaryComponent, {
        // ariaLabelledBy: 'modal-basic-title',
        // size: 'lg',
        backdrop: "static",
        windowClass: "update-summary-wrap"
      });
      modal.componentInstance.dataUpdate = this.judgementDetail;
      modal.result.then((result) => {
        if (result) {
          // Set saved to resave in judgment array.
          this.judgementDetail.is_saved = true;
        }
      });
    } else {
      this.modalService.dismissAll("Open login modal");
      this.modalService.open(LoginComponent, {
        backdrop: "static"
      });
    }
  }

  onSaveAgain() {
    this.confirmDialog
      .confirm("", "You seem to have saved this judgment before.  Would you like to save again under a new topic?")
      .then(
        (confirmed) => {
          if (confirmed) {
            //judgement.loader = true;
            this.onSave();
          } else {
            console.log('no')
          }
        }
      ).catch(
        (reason: any) => {

        }
      );
  }

  onViewredirectDetail(id) {
    if (id) {
      window.open(id, "_blank");
    }
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

  unsaveJudgement() {
    var judgement = this.judgementDetail;
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

  onShareClick() {
    this.showShare = !this.showShare;
  }

  onChangeScreenSize() {
    if (this.screenWidth <= 576) {
      this.showShare = !this.showShare;
    } else {
      this.showShare = this.showShare;
    }
  }

  onReadMore(data) {
    data.showMore = !data.showMore;
  }

  onSearchIconClick() {
    //this.showMobileSearchBar = !this.showMobileSearchBar;
  }
}
