import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserComponent } from './components/user/user.component';
import {RouterModule, Routes} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
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



const routes: Routes = [
  {path: 'users', component: UserComponent},
  {path: 'search/:keyword', component: BugReportComponent},
  {path: 'bugs', component: BugReportComponent},
  {path: 'buglogs', component: BugReportLogComponent},
  {path: 'bugreport/add', component: BugReportFormComponent},
  {path: 'bugdetails/:id', component: BugReportDetailsComponent},
  {path: '', redirectTo: '/bugs', pathMatch: 'full'},
  {path: '**', redirectTo: '/bugs', pathMatch: 'full'}
];


@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    BugReportComponent,
    BugReportLogComponent,
    SearchComponent,
    AnimatedBugComponent,
    BugReportFormComponent,
    BugReportFormComponent,
    BugReportDetailsComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [UserService, BugReportService, BugReportLogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
