import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ToastrModule } from "ngx-toastr";
// import { CKEditorModule } from "ckeditor4-angular";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { OwlModule } from "ngx-owl-carousel";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { NgDatepickerModule } from "ng2-datepicker";
import { CalendarModule } from "primeng/calendar";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { NgxPrintModule } from 'ngx-print';


import {
  SocialLoginModule,
  GoogleLoginProvider,
  FacebookLoginProvider,
  AuthServiceConfig
} from "angularx-social-login";

import { AppComponent } from "./app.component";
import { AppHeaderComponent } from "../app/components/header/header.component";
import { AppFooterComponent } from "../app/components/footer/footer.component";
import { HomeComponent } from "../app/components/home/home.component";
import { LoginComponent } from "../modals/login/login.component";
import { ForgotPasswordComponent } from "../modals/forgot-password/forgot-password.component";
import { AddSummaryComponent } from "../modals/add-summary/add-summary.component";
import { SignUpComponent } from "../modals/signup/signup.component";
import { CasebookSummaryComponent } from "../app/components/casebook-summary/casebook-summary.component";
import { CourtListComponent } from "../app/components/court-list/court-list.component";
import { AppRoutingModule } from "./app-routing.module";
import { AuthGuard } from "./services/auth-guard";
import { AuthService1 } from "./services/auth.service";
import { Interceptor } from "./services/auth.interceptor";
import { VerifyComponent } from "./components/verify/verify.component";
import { MyToastrService } from "./services/toastr.service";
import { CaseLawsComponent } from "./components/caselaws/caselaws.component";
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";
import { ChangePasswordComponent } from "./components/change-password/change-password.component";
import { HomeService } from "./services/home.service";
import { SlugListComponent } from "./components/slug-list/slug-list.component";
import { CaseLawsService } from "./services/caselaws.service";
import { CaseBooksService } from "./services/casebooks.service";
import { JudegMentDetailComponent } from "./components/judegment-detail/judegment-detail.component";
import { UpdateSummaryComponent } from "../modals/update-summary/update-summary.component";
import { AboutComponent } from "./components/about/about.component";
import { TermsComponent } from "./components/terms/terms.component";
import { PrivacyComponent } from "./components/privacy/privacy.component";
import { GuidlineComponent } from "./components/guideline/guideline.component";
import { CommonService } from "./services/common.service";
import { ElementFocusDirective } from "./directives/ElementFocus.directive";
import { BoradcastService } from "./services/broadcast.service";
import { MyAccountComponent } from "./components/my-account/my-account.component";
import { RandStringService } from "./services/random-string.service";
import { TwitterService } from "../modals/login/twitter.service";
import { ConfirmDialogComponent } from "../modals/confirm-dialog/confirm-dialog.component";
import { ConfirmDialogService } from "../modals/confirm-dialog/confirm-dialog.servicey";
import { NgHighlightModule } from 'ngx-text-highlight';
import { NgpSortModule } from "ngp-sort-pipe";
import { MyLoaderComponent } from './components/my-loader/my-loader.component';
import { HighlightSearch } from "./highlight_pipe.pipe";
import { ShareComponent } from "./components/share/share.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { ExpandMenu } from './../app/directives/expand-menu.directive';
import { NoDataFoundComponent } from './components/no-data-found/no-data-found.component';
import { SubtopicSlugComponent } from './components/subtopic-slug/subtopic-slug.component';
import { SearchTopicComponent } from './components/search-topic/search-topic.component';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AnalyticsService } from "./services/analytics.service";
// import { GtagModule } from "angular-gtag";
// import { MetaModule } from "@ngx-meta/core";
// import { metaFactory } from "./meta.factory";





let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(environment.googleId)
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(environment.facebookId)
  }
]);
export function provideConfig() {
  return config;
}
@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppFooterComponent,
    ConfirmDialogComponent,
    HomeComponent,
    LoginComponent,
    ForgotPasswordComponent,
    AddSummaryComponent,
    SignUpComponent,
    CasebookSummaryComponent,
    CourtListComponent,
    VerifyComponent,
    CaseLawsComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    SlugListComponent,
    JudegMentDetailComponent,
    UpdateSummaryComponent,
    AboutComponent,
    TermsComponent,
    PrivacyComponent,
    GuidlineComponent,
    ElementFocusDirective,
    MyAccountComponent,
    MyLoaderComponent,
    HighlightSearch,
    ShareComponent,
    ExpandMenu,
    NoDataFoundComponent,
    SubtopicSlugComponent,
    SearchTopicComponent,

  ],
  imports: [
    // GtagModule.forRoot({
    //   trackingId: environment.googleAnalyticsId, trackPageviews: true
    // }),
    BrowserModule.withServerTransition({ appId: 'oncavet' }),
    AppRoutingModule,
    RouterModule,
    NgbModule,
    // CKEditorModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    OwlModule,
    AngularEditorModule,
    NgDatepickerModule,
    CalendarModule,
    SocialLoginModule,
    NgHighlightModule,
    NgMultiSelectDropDownModule.forRoot(),
    AngularMultiSelectModule,
    NgpSortModule,
    NgxPrintModule,
    ToastrModule.forRoot(),
    NgSelectModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),



    // ShareButtonsModule
  ],
  providers: [
    AuthService1,
    AuthGuard,
    MyToastrService,
    ConfirmDialogService,
    CommonService,
    BoradcastService,
    HomeService,
    CaseLawsService,
    CaseBooksService,
    RandStringService,
    TwitterService,
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    AnalyticsService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    SignUpComponent,
    LoginComponent,
    ForgotPasswordComponent,
    AddSummaryComponent,
    UpdateSummaryComponent,
    ConfirmDialogComponent
  ]
})
export class AppModule { }
