import { Component, OnInit } from '@angular/core';
import { BugReportLog } from '../../common/bug-report-log';
import { BugReportLogService } from '../../services/bug-report-log.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-bug-report-log',
  templateUrl: './bug-report-log.component.html',
  styleUrls: ['./bug-report-log.component.css'],
  standalone: false
})
export class BugReportLogComponent implements OnInit {

  bugReportLogs: BugReportLog[] = [];
  searchMode: boolean = false;

  constructor(private bugReportLogService: BugReportLogService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.listBugReportLogs();
  }

  // listBugReportLogs() {
  //   this.bugReportLogService.getBugReportLogsList().subscribe(
  //     data => {
  //       this.bugReportLogs = data;
  //     },
  //     error => {
  //       console.error('Error fetching bug report logs:', error);
  //     }
  //   );
  // }

  listBugReportLogs() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');


    if (this.searchMode) {
      this.handleSearchBugReportLogs();
    }
    else {
      this.handleListBugReportLogs();
    }
  }


  handleSearchBugReportLogs() {
    // const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    //
    // this.bugReportLogService.searchBugReportLogs(theKeyword).subscribe(
    //   data => {
    //     this.bugReportLogs = data;
    //   }
    // )
  }

  handleListBugReportLogs() {

    this.bugReportLogService.getBugReportLogsList().subscribe(
      data => {
        this.bugReportLogs = data;
      }
    )
  }
}
