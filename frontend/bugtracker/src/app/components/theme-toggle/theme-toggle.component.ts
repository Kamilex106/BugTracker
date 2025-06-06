import { Component, OnInit } from '@angular/core';
import { ThemeService, Theme } from '../../services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.css'],
  standalone: false
})
export class ThemeToggleComponent implements OnInit {
  currentTheme$: Observable<Theme>;

  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.theme$;
  }

  ngOnInit(): void {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
