import { Component, ViewChild, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";

import { HomeService } from "../../services/home.service";
import { MyToastrService } from "../../services/toastr.service";
import { UpdateSummaryComponent } from "../../../modals/update-summary/update-summary.component";
import { AuthService1 } from "../../services/auth.service";
import { LoginComponent } from "../../../modals/login/login.component";
import { CommonService } from "../../services/common.service";
import { CaseBooksService } from "../../services/casebooks.service";
import { ConfirmDialogService } from "../../../modals/confirm-dialog/confirm-dialog.servicey";
// import { Meta } from "@angular/platform-browser";
// import { MetaService } from "@ngx-meta/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
  carouselOptions = {
    margin: 25,
    // nav: true,
    responsiveClass: true,
    items: 3,
    responsive: {
      0: {
        items: 1
        // nav: true
      },
      600: {
        items: 1
        // nav: true
      },
      1000: {
        items: 2,
        // nav: true,
        loop: false
      },
      1200: {
        items: 3,
        // nav: true,
        loop: false
      }
    }
  };

  slideData: any = [];
  todayDigestList: any = [];
  todayDigestDate: any = []
  showDigestList: any = [];
  searchData: any;
  email: any;
  start = 0;
  end = 2;
  readMoreData;
  toggleRead: boolean = false;

  constructor(
    private homeService: HomeService,
    private toastrService: MyToastrService,
    private router: Router,
    public confirmDialog: ConfirmDialogService,
    public modalService: NgbModal,
    public casebookService: CaseBooksService,
    public commonService: CommonService,
    public AuthService1: AuthService1,
    // private meta: MetaService
  ) { }
  ngOnInit() {
    // this.meta.setTag( 'description', 'ONCAVEAT Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facere, laudantium voluptatem assumenda omnis nisi in');
    // this.meta.setTag( 'keywords', 'ONCAVEAT');
    // this.meta.setTag( 'og:title', 'Home - ONCAVEAT ');
    // this.meta.setTag( 'og:description', 'ONCAVEAT Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facere, laudantium voluptatem assumenda omnis nisi in');

    this.getSliderData();
    this.getTodayDigestList();
  }

  onNextSearchPosition() {
    var element = document.getElementById("destination");
    element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  }
  onNextSearchTest() {
    var element = document.getElementById("newtest");
    element.scrollIntoView(true);
  }

  onClickNewsLetter() {

    // const url = this.router.serializeUrl(
    //   this.router.createUrlTree([`/oncaveat/public/media/newsletter.html`])
    // );

    let url = "https://admin.oncaveat.com/media/newsletter.html"
    window.open(url, "_blank")
  }
  onReadMore(data) {
    data.showMore = !data.showMore;
  }

  getSliderData() {
    this.homeService.getSlideData().subscribe((res: any) => {
      this.slideData = res.data;
    });
  }

  getTodayDigestList() {
    this.homeService.getTodayDigestList().subscribe((res: any) => {
      this.todayDigestDate = res
      this.todayDigestList = res.judgments_list;
      // this.todayDigestList.map(data => {
      //   data["showMore"] = false;
      // });
    });
  }
  onJudgeNameClick(name) {
    this.router.navigate(["caselaws"], { queryParams: { judgeName: name } });
  }
  onSubscribe() {
    this.homeService.emailSubscribe({ email: this.email }).subscribe(
      (res: any) => {
        if (res.status === 200) {
          if (res.success) {
            this.email = '';
            localStorage.setItem("currentUser", JSON.stringify(res));
            this.toastrService.showToast(res.message, "", "success");
          } else {
            this.toastrService.showToast(res.message, "", "error");
          }
        }
      },
      err => {
        if (err.status === 401) {
          this.toastrService.showToast(err.error.message, "", "error");
        }
      }
    );
  }

  onSlugClick(value) {
    if (value) {
      this.router.navigate(["/topics", value]);
    } else {
      this.router.navigate(["/"]);
    }
  }

  onSearchClick() {
    this.router.navigate(["/caselaws"]);
  }

  onViewMore() {
    if (this.end <= this.todayDigestList.length) {
      this.start = this.end;
      this.end = this.start + 2;
    }
  }

  onSearch() {
    this.router.navigate(["caselaws"], {
      queryParams: { searchData: this.searchData }
    });
  }

  onSave(data) {
    if (this.AuthService1.isAuthenticated()) {
      console.log("Logged In");
      this.modalService.dismissAll("Open login modal");
      const modal = this.modalService.open(UpdateSummaryComponent, {
        // ariaLabelledBy: 'modal-basic-title',
        // size: 'lg',
        backdrop: "static",
        windowClass: "update-summary-wrap"
      });
      modal.componentInstance.data = data;
    } else {
      this.modalService.dismissAll("Open login modal");
      this.modalService.open(LoginComponent, {
        backdrop: "static"
      });
    }
  }


  unsaveJudgement(judgement) {
    if (judgement.is_saved && !judgement.loader) {
      this.confirmDialog
        .confirm("Unsave !", "Are you sure you want to unsave selected judement ?")
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

  onViewDetail(id) {
    this.router.navigate(["judegment-detail", id]);
  }

  getKeys(object): object {
    return Object.keys(object);
  }
}
