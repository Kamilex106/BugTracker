import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-animated-bug',
  standalone: false,
  templateUrl: './animated-bug.component.html',
  styleUrl: './animated-bug.component.css'
})
export class AnimatedBugComponent implements OnInit {
  showBug = false;

  ngOnInit(): void {
    this.displayBugPeriodically();
  }

  displayBugPeriodically(): void {
    setInterval(() => {
      this.showBug = true;
      setTimeout(() => {
        this.showBug = false;
      }, 2000);
    }, 8000);
  }
}
