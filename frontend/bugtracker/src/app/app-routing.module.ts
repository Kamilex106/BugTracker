import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {UserComponent} from './components/user/user.component';
import {BugReportComponent} from './components/bug-report/bug-report.component';
import {BugReportLogComponent} from './components/bug-report-log/bug-report-log.component';
import {BugReportFormComponent} from './components/bug-report-add-form/bug-report-form.component';
import {BugReportDetailsComponent} from './components/bug-report-details/bug-report-details.component';
import { Routes } from '@angular/router';
import { OktaCallbackComponent } from '@okta/okta-angular';

import { OktaAuthGuard } from '@okta/okta-angular';
import {RegistrationComponent} from './components/registration/registration.component';
import {BugAssignmentComponent} from './components/bug-assignment/bug-assignment.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {AssignedBugsComponent} from './components/assigned-bugs/assigned-bugs.component';

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'login/callback', component: OktaCallbackComponent },
  {path: 'users', component: UserComponent},
  {path: 'search/:keyword', component: BugReportComponent},
  {path: 'bugs', component: BugReportComponent},
  {path: 'buglogs', component: BugReportLogComponent},
  {path: 'bugreport/add', component: BugReportFormComponent},
  {path: 'assigned-bugs', component: AssignedBugsComponent},
  {path: 'bugdetails/:id', component: BugReportDetailsComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'app-bug-assignment', component: BugAssignmentComponent},
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: '**', redirectTo: '/dashboard', pathMatch: 'full'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
