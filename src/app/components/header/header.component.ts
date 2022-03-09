import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { LoginComponent } from "../../../modals/login/login.component";
import { AuthService1 } from "../../services/auth.service";
import { MyToastrService } from "../../services/toastr.service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { CommonService } from "../../services/common.service";
import { SignUpComponent } from "../../../modals/signup/signup.component";
import { CaseLawsService } from "../../services/caselaws.service";
import { Subject } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppHeaderComponent implements OnInit {
  currentUser: any;
  userName: any;
  judgementId: any;

  constructor(
    public modalService: NgbModal,
    public AuthService1: AuthService1,
    public commonService: CommonService,
    private toastrService: MyToastrService,
    public router: Router,
    public _router: ActivatedRoute,
    private caseLawService: CaseLawsService,
  ) { }

  /* Show login user name */
  assignLoginData(): void {
    if (this.AuthService1.isAuthenticated()) {
      this.currentUser = JSON.parse(localStorage.getItem("currentUser"))
      this.userName = this.currentUser.data.first_name.slice(0, 1).toUpperCase();
    } else {
      this.userName = '';
    }
    this.judgementId = localStorage.getItem('judgementId');
  }

  /*Show login user name when login */
  ngOnInit() {
    this.AuthService1.currentUserLogin.subscribe(
      res => {
        this.currentUser = res
        this.userName = this.currentUser.data.first_name.slice(0, 1).toUpperCase();
      }
    )
    this.AuthService1.judegmentId.subscribe(
      res => {
        this.judgementId = res;
      }
    )
    this.assignLoginData();
  }
  /* Sign Up */
  openSignUpnModal() {
    this.modalService.dismissAll("Open login modal");
    this.modalService.open(SignUpComponent, {
      backdrop: "static"
    });
  }

  /* Sign model */
  openSignInModal() {
    this.modalService.dismissAll("Open login modal");
    this.modalService.open(LoginComponent, {
      backdrop: "static"
    });
  }

  /* Logout */
  onLogout() {
    this.AuthService1.logout().subscribe(
      res => {
        if (res) {
          this.toastrService.showToast(
            "Sign back in any time.",
            "",
            "success"
          );
          // window.location.reload();
          this.AuthService1.currentUser = "";
          localStorage.removeItem("currentUser");
          if (this.router.url === '/') {
            this.router.navigate(["/"]);
          } else if (this.router.url === '/caselaws') {
            this.router.navigate(["/caselaws"]);
          }
        }
      },
      err => {
        this.toastrService.showToast(err.error.message, "", "error");
      }
    );
    localStorage.removeItem('judgementId');
  }

  /* Search Icon click */
  onSearchIconClick() {
    this.commonService.isSearchOpen = !this.commonService.isSearchOpen;
  }

  /** caselawsClick */
  oncashLaw() {
    window.open('caselaws', "_self");
  }

  onClickSavedCases() {
    window.open('casebook', "_self");
  }

  /* Caselawpage */
  isCaselawPage() {
    return this.router.isActive('/caselaws', true) || this.router.isActive('/topics', false);
  }

  /* Menu open */
  openMenu() {
    setTimeout(() => {
      this.commonService.isMobileMenuOpen = !this.commonService.isMobileMenuOpen;
    }, 150);
  }

  /* Menu close when outside click */
  onClickedOutside(e) {
    if (this.commonService.isMobileMenuOpen) {
      setTimeout(() => {
        this.commonService.isMobileMenuOpen = false;
      }, 150);
    }
  }
}
