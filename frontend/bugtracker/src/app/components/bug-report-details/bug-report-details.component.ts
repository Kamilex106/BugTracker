import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BugReportService } from '../../services/bug-report.service';
import { BugReport } from '../../common/bug-report';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../common/comment';
import { LogService } from '../../services/log.service';
import { forkJoin } from 'rxjs';
import { CurrentUserService } from '../../services/current-user.service';

@Component({
  selector: 'app-bug-report-details',
  templateUrl: './bug-report-details.component.html',
  standalone: false,
  styleUrls: ['./bug-report-details.component.css']
})
export class BugReportDetailsComponent implements OnInit {
  bugReport?: BugReport;
  timelineItems: any[] = [];
  newComment: string = '';
  isAdmin: boolean = false;
  availableStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
  selectedStatus?: string;
  selectedStatusForComment?: string;

  constructor(
    private route: ActivatedRoute,
    private bugReportService: BugReportService,
    private commentService: CommentService,
    private logService: LogService,
    private currentUserService: CurrentUserService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.loadBugReport(id);
      this.loadTimelineItems(id);
      this.subscribeToUserRoles();
    }
  }

  private subscribeToUserRoles(): void {
    this.currentUserService.roles$.subscribe(roles => {
      this.isAdmin = this.currentUserService.hasRole('ROLE_ADMIN');
      console.log('User roles updated:', roles);
      console.log('User is admin:', this.isAdmin);
    });
  }

  checkUserRole(): void {
    // Sprawdź czy użytkownik ma rolę ADMIN
    this.isAdmin = this.currentUserService.hasRole('ROLE_ADMIN');
    console.log('User is admin:', this.isAdmin);
    console.log('User roles:', this.currentUserService.getRoles());
  }

  loadBugReport(id: number): void {
    this.bugReportService.getBugReportById(id).subscribe({
      next: (data) => {
        this.bugReport = data;
        console.log('Loaded bug report:', this.bugReport);
        console.log('Status:', this.bugReport.actualStatus);
      },
      error: (err) => {
        console.error('Error fetching report:', err);
      }
    });
  }

  loadTimelineItems(bugReportId: number): void {
    forkJoin([
      this.commentService.getCommentsByBugReportId(bugReportId),
      this.logService.getLogsByBugReportId(bugReportId)
    ]).subscribe({
      next: ([comments, logs]) => {
        const statusChanges = logs.map(log => ({
          type: 'statusChange',
          date: log.date,
          comment: log.comment,
          status: log.bugStatus.name,
        }));

        const commentItems = (comments as Comment[]).map((comment: Comment) => ({
          type: 'comment',
          user: comment.user,
          date: comment.date,
          comment: comment.comment
        }));

        this.timelineItems = [...statusChanges, ...commentItems].sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      },
      error: (err) => {
        console.error('Error fetching timeline items:', err);
      }
    });
  }

  changeStatus(): void {
    if (!this.selectedStatus || !this.bugReport || !this.isAdmin) return;

    this.bugReportService.updateBugReportStatus(this.bugReport.id!, this.selectedStatus)
      .subscribe({
        next: () => {
          this.showMessage('Status updated successfully', 'success');
          this.loadBugReport(this.bugReport!.id!);
          this.loadTimelineItems(this.bugReport!.id!);
          this.selectedStatus = undefined;
        },
        error: (err) => {
          console.error('Error updating status:', err);
          this.showMessage('Failed to update status', 'error');
        }
      });
  }

  showMessage(msg: string, type: 'success' | 'error'): void {
    alert(msg);
  }

  submitCommentWithOptionalStatusChange(): void {
    if (!this.bugReport?.id || (!this.newComment.trim() && !this.selectedStatusForComment)) {
      console.log('Validation failed - missing required data');
      return;
    }

    const userId = Number(this.currentUserService.getId());
    console.log('User ID:', userId);

    if (!userId) {
      console.error('User ID not available');
      return;
    }

    // Jeśli jest zmiana statusu I użytkownik jest adminem
    if (this.selectedStatusForComment && this.isAdmin) {
      console.log('Updating status to:', this.selectedStatusForComment);

      this.bugReportService.updateBugReportStatus(this.bugReport.id!, this.selectedStatusForComment)
        .subscribe({
          next: () => {
            console.log('Status updated successfully');

            if (this.bugReport) {
              this.bugReport.actualStatus = { name: this.selectedStatusForComment! } as any;
            }

            if (this.newComment.trim()) {
              this.addCommentAfterStatusChange();
            } else {
              this.loadTimelineItems(this.bugReport!.id!);
              this.selectedStatusForComment = undefined;
            }
          },
          error: (err) => {
            console.error('Error updating status:', err);
          }
        });
    } else {
      // Tylko komentarz bez zmiany statusu
      this.addCommentOnly();
    }
  }

  private addCommentAfterStatusChange(): void {
    if (!this.newComment.trim() || !this.bugReport?.id) return;

    const userId = Number(this.currentUserService.getId());
    const payload = {
      comment: this.newComment,
      bugReport: { id: this.bugReport.id },
      user: { id: userId }
    };

    console.log('Adding comment after status change:', payload);

    this.commentService.addComment(payload).subscribe({
      next: (comment) => {
        console.log('Comment added successfully after status change:', comment);
        this.loadTimelineItems(this.bugReport!.id!);
        this.newComment = '';
        this.selectedStatusForComment = undefined;
      },
      error: (err) => {
        console.error('Error adding comment after status change:', err);
      }
    });
  }

  private addCommentOnly(): void {
    if (!this.newComment.trim() || !this.bugReport?.id) return;

    const userId = Number(this.currentUserService.getId());
    const payload = {
      comment: this.newComment,
      bugReport: { id: this.bugReport.id },
      user: { id: userId }
    };

    this.commentService.addComment(payload).subscribe({
      next: (comment) => {
        console.log('Comment added successfully:', comment);
        this.timelineItems.unshift({
          type: 'comment',
          user: comment.user,
          date: comment.date,
          comment: comment.comment
        });
        this.newComment = '';
      },
      error: (err) => {
        console.error('Error adding comment:', err);
      }
    });
  }

  trackByFn(index: number, item: any): any {
    return item.date || index;
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return '';
    const statusLower = status.toLowerCase().replace(/\s+/g, '-');
    return `status-${statusLower}`;
  }

  isBugClosed(): boolean {
    return this.bugReport?.actualStatus?.name === 'Closed';
  }

  canAddComments(): boolean {
    return !this.isBugClosed();
  }
}
