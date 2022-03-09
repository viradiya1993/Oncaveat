import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "../app/components/home/home.component";
import { CasebookSummaryComponent } from "./components/casebook-summary/casebook-summary.component";
import { AuthGuard } from "./services/auth-guard";
import { VerifyComponent } from "./components/verify/verify.component";
import { CaseLawsComponent } from "./components/caselaws/caselaws.component";
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";
import { ChangePasswordComponent } from "./components/change-password/change-password.component";
import { SlugListComponent } from "./components/slug-list/slug-list.component";
import { JudegMentDetailComponent } from "./components/judegment-detail/judegment-detail.component";
import { AboutComponent } from "./components/about/about.component";
import { TermsComponent } from "./components/terms/terms.component";
import { PrivacyComponent } from "./components/privacy/privacy.component";
import { GuidlineComponent } from "./components/guideline/guideline.component";
import { MyAccountComponent } from "./components/my-account/my-account.component";
import { ShareComponent } from "./components/share/share.component";
import { NoDataFoundComponent } from "./components/no-data-found/no-data-found.component";
import { SubtopicSlugComponent } from "./components/subtopic-slug/subtopic-slug.component";
import { SearchTopicComponent } from "./components/search-topic/search-topic.component";
import { environment } from "../environments/environment";
const appRoutes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "casebook",
    component: CasebookSummaryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "caselaws",
    component: CaseLawsComponent
  },
  {
    path: "change-password",
    component: ChangePasswordComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "verify-user/:token",
    component: VerifyComponent
  },
  {
    path: "reset-password/:token",
    component: ResetPasswordComponent
  },
  {
    path: "topics/:slug",
    component: SlugListComponent,
    pathMatch: 'full'
  },
  {
    path: "search-topics/:slug",
    component: SearchTopicComponent,
    pathMatch: 'full'
  },
  {
    path: "sub-topic/:slug",
    component: SubtopicSlugComponent,
    pathMatch: 'full'
  },
  {
    path: "judegment-detail/:id",
    component: JudegMentDetailComponent,
  },
  {
    path: "my-account",
    component: MyAccountComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "about",
    component: AboutComponent
  },
  {
    path: "terms",
    component: TermsComponent
  },
  {
    path: "privacy_policy",
    component: PrivacyComponent
  },
  {
    path: "guideline",
    component: GuidlineComponent
  },
  {
    path: "share",
    component: ShareComponent
  },
  {
    path: "casebook-new",
    component: NoDataFoundComponent
  },
  {
    path: "**",
    component: HomeComponent
  }
];
@NgModule({
  imports: [CommonModule, RouterModule.forRoot(appRoutes, {onSameUrlNavigation : "reload", scrollPositionRestoration: 'enabled'})],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule {}
