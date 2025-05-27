
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BugReportService } from '../../services/bug-report.service';
import { BugReport } from '../../common/bug-report';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private allBugReports: BugReport[] = [];

  timeFilter: string = 'Today';
  isLoading: boolean = false;

  // Data properties - zachowujemy te same nazwy co wcześniej
  bugSummary = {
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  };

  userAssignments: any[] = [];
  categoryData: any[] = [];
  recentActivity: any[] = [];

  constructor(private bugReportService: BugReportService) { }

  ngOnInit(): void {
    this.loadBugReports();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setTimeFilter(filter: string): void {
    this.timeFilter = filter;
    this.calculateDashboardData();

    // Trigger CSS animation reset
    document.body.classList.add('reset-animations');
    setTimeout(() => {
      document.body.classList.remove('reset-animations');
    }, 10);
  }

  private loadBugReports(): void {
    this.isLoading = true;

    // Używamy istniejącej metody z BugReportService
    this.bugReportService.getBugReportListPaginatedFiltered(0, 1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: BugReport[]) => {
          this.allBugReports = data;
          this.calculateDashboardData();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading bug reports:', error);
          this.isLoading = false;
        }
      });
  }

  private calculateDashboardData(): void {
    const filteredReports = this.filterReportsByTime(this.allBugReports);

    this.bugSummary = this.calculateBugSummary(filteredReports);
    this.userAssignments = this.calculateUserAssignments(filteredReports);
    this.categoryData = this.calculateCategoryData(filteredReports);
    this.recentActivity = this.calculateRecentActivity(this.allBugReports.slice(0, 10));
  }

  private filterReportsByTime(reports: BugReport[]): BugReport[] {
    if (this.timeFilter === 'All Time') {
      return reports;
    }

    const now = new Date();
    let filterDate: Date;

    switch (this.timeFilter) {
      case 'Today':
        filterDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'This Week':
        filterDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'This Month':
        filterDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        return reports;
    }

    return reports.filter(report => {
      if (!report.createdAt) return false;
      const reportDate = new Date(report.createdAt);
      return reportDate >= filterDate;
    });
  }

  private calculateBugSummary(reports: BugReport[]): any {
    const summary = {
      total: reports.length,
      open: 0,
      inProgress: 0,
      resolved: 0,
      closed: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };

    reports.forEach(report => {
      // Count by status - używamy actualStatus.name
      const status = report.actualStatus?.name?.toLowerCase().trim() || '';
      if (status.includes('open') || status === 'new') {
        summary.open++;
      } else if (status.includes('progress') || status.includes('assigned')) {
        summary.inProgress++;
      } else if (status.includes('resolved')) {
        summary.resolved++;
      } else if (status.includes('closed')) {
        summary.closed++;
      }

      // Count by priority
      const priority = report.priority?.toLowerCase().trim() || '';
      if (priority === 'critical') {
        summary.critical++;
      } else if (priority === 'high') {
        summary.high++;
      } else if (priority === 'medium') {
        summary.medium++;
      } else if (priority === 'low') {
        summary.low++;
      }
    });

    return summary;
  }

  private calculateUserAssignments(reports: BugReport[]): any[] {
    const assignmentMap = new Map<string, number>();

    reports.forEach(report => {
      // Używamy user.username lub fallback
      const assignee = report.user?.username || 'Unassigned';
      assignmentMap.set(assignee, (assignmentMap.get(assignee) || 0) + 1);
    });

    return Array.from(assignmentMap.entries())
      .map(([name, tickets]) => ({ name, tickets }))
      .sort((a, b) => b.tickets - a.tickets)
      .slice(0, 5); // Top 5 users
  }

  private calculateCategoryData(reports: BugReport[]): any[] {
    const categoryMap = new Map<string, number>();

    reports.forEach(report => {
      const categoryName = report.category?.name || 'Uncategorized';
      categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1);
    });

    return Array.from(categoryMap.entries())
      .map(([name, tickets]) => ({ name, tickets }))
      .sort((a, b) => b.tickets - a.tickets)
      .slice(0, 5); // Top 5 categories
  }

  private calculateRecentActivity(reports: BugReport[]): any[] {
    return reports
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 10)
      .map((report, index) => ({
        id: report.id || index,
        action: 'Created bug report',
        title: report.title || 'No title',
        user: report.user?.username || 'Unknown',
        time: this.formatTimeAgo(new Date(report.createdAt || Date.now()))
      }));
  }

  private formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) { // less than 24 hours
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }

  // Calculate percentage for progress bars and charts
  getPercentage(value: number): number {
    if (this.bugSummary.total === 0) return 0;
    return (value / this.bugSummary.total) * 100;
  }

  // Calculate the stroke-dasharray value for SVG circle
  getCircleStrokeDashValue(value: number): number {
    const circumference = 2 * Math.PI * 40; // 2πr where r=40
    if (this.bugSummary.total === 0) return 0;
    return (value / this.bugSummary.total) * circumference;
  }

  // Generate random start values for animations (kept for CSS animations)
  getRandomStartValue(targetValue: number): number {
    const minValue = Math.floor(targetValue * 0.2);
    const maxValue = Math.floor(targetValue * 0.6);
    return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
  }
}
