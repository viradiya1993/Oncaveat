import { Component, Inject } from "@angular/core";
import { Router, NavigationStart, NavigationEnd, ActivatedRoute } from "@angular/router";
import { AuthService1 } from "./services/auth.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "./services/common.service";
import { DOCUMENT } from "@angular/platform-browser";
import { SwUpdate } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { filter, map, mergeMap, tap } from 'rxjs/operators';
import { AnalyticsService } from "./services/analytics.service";
// import { Gtag } from "angular-gtag";
// import { } from '@types/google.analytics';

declare let ga: Function;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  titile = 'Oncaveat project meta';
  showHead: boolean = false;
  showFoot: boolean = false;
  update: boolean = false;
  baseUrl: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private AuthService1: AuthService1,
    private modalService: NgbModal,
    public commonService: CommonService,
    // gtag: Gtag,
    public analytics: AnalyticsService,
    @Inject(DOCUMENT) private document: Document, private updates: SwUpdate,

  ) {
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     console.log(event);

    //     ga('set', 'page', event.urlAfterRedirects);
    //     ga('send', 'pageview');
    //   }
    // });

    // Google Analytics Tags.
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     console.log(gtag);

    //     gtag.pageview(
    //     );
    //   }
    // });

    this.analytics.init();

    updates.available.subscribe(e => {
      updates.activateUpdate().then(() => {
        // document.location.reload();
        updates.activateUpdate().then(() => document.location.reload());
      })
    })
    router.events.forEach(event => {
      if (event instanceof NavigationStart) {
        if (event["url"] == "/casebook") {
          if (AuthService1.isAuthenticated()) {
            this.showHead = false;
            this.showFoot = false;
          } else {
            this.showHead = true;
            this.showFoot = true;
          }
        } else {
          this.showHead = true;
          this.showFoot = true;
        }
      }
    });
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.modalService.dismissAll();
        // window.scrollTo(0, 0);
        this.document.body.classList.remove('overflow');
        setTimeout(() => {
          if (!(this.router.isActive('/caselaws', true) || this.router.isActive('/topics', false))) {
            this.commonService.isHeaderSearchVisible = false;
          } else {
            this.commonService.isHeaderSearchVisible = true;
          }
          this.commonService.isSearchOpen = false;
          this.commonService.isMobileMenuOpen = false;
        }, 100);
      }
    });

  }
}
