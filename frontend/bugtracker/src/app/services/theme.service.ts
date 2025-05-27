import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = new BehaviorSubject<Theme>('dark');
  public theme$ = this.currentTheme.asObservable();

  constructor() {
    this.loadTheme();
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    this.setTheme(theme);
  }

  setTheme(theme: Theme): void {
    this.currentTheme.next(theme);
    localStorage.setItem('theme', theme);

    // Update body class - to wystarczy!
    document.body.className = document.body.className.replace(/theme-\w+/, '');
    document.body.classList.add(`theme-${theme}`);
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  getCurrentTheme(): Theme {
    return this.currentTheme.value;
  }
}
