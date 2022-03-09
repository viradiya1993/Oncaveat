import { Injectable } from "@angular/core";
import {
  CanActivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService1 } from "./auth.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LoginComponent } from "../../modals/login/login.component";

@Injectable()
export class AuthGuard implements CanActivate {
  currentUser: any;
  constructor(
    private router: Router,
    private AuthService1: AuthService1,
    public modalService: NgbModal
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.AuthService1.isAuthenticated()) {
      return true;
    } else {
      console.log("Not Logged In");
      this.router.navigate(["/"]);
      this.modalService.dismissAll("Open login modal");
      this.modalService.open(LoginComponent, {
        backdrop: "static"
      });
      return false;
    }
  }
}
