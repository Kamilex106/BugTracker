import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserComponent } from './components/user/user.component';
import {RouterModule, Routes} from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {UserService} from './services/user.service';

import { BugReportComponent } from './components/bug-report/bug-report.component';
import { BugReportLogComponent } from './components/bug-report-log/bug-report-log.component';
import {BugReportLogService} from './services/bug-report-log.service';
import {BugReportService} from './services/bug-report.service';
import { SearchComponent } from './components/search/search.component';
import { AnimatedBugComponent } from './components/animated-bug/animated-bug.component';
import {FormsModule} from '@angular/forms';
import { BugReportFormComponent } from './components/bug-report-form/bug-report-form.component';
import { BugReportDetailsComponent } from './components/bug-report-details/bug-report-details.component';

import { OKTA_CONFIG, OktaAuthModule } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

import { oktaConfig } from './okta.config';
import { HomeComponent } from './components/home/home.component';
import {AuthInterceptor} from './auth.interceptor';
import { RegistrationComponent } from './components/registration/registration.component';

const oktaAuth = new OktaAuth(oktaConfig);




@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    BugReportComponent,
    BugReportLogComponent,
    SearchComponent,
    AnimatedBugComponent,
    BugReportFormComponent,
    BugReportDetailsComponent,
    HomeComponent,
    RegistrationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    OktaAuthModule
  ],
  providers: [UserService, BugReportService, BugReportLogService, { provide: OKTA_CONFIG, useValue: { oktaAuth } },
    { provide: OktaAuth, useValue: oktaAuth },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
