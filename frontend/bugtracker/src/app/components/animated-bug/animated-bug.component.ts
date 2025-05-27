import { Component } from '@angular/core';

@Component({
  selector: 'app-animated-bug',
  templateUrl: './animated-bug.component.html',
  styleUrls: ['./animated-bug.component.css'],
  standalone: false
})
export class AnimatedBugComponent {
  bugClicks = 0;
  isShaking = false;
  bubbleMessage = '';
  showRain = false;

  rainBugs: { id: number, animationClass: string, left: number, size: number }[] = [];

  onBugClick(): void {
    this.bugClicks++;
    console.log(`Kliknięcia w robaczka: ${this.bugClicks}`);

    this.isShaking = false;
    setTimeout(() => {
      this.isShaking = true;
      setTimeout(() => this.isShaking = false, 3000);
    }, 10);

    if (this.bugClicks % 5 === 0) {
      const robaczekText = this.getBugText(this.bugClicks);
      const messages = [
        `Great! You've already caught ${this.bugClicks} ${robaczekText}! You're becoming a catching master!`,
        `Wow! ${this.bugClicks} ${robaczekText} in the bag! Great job!`,
        `You've got ${this.bugClicks} ${robaczekText}! Could you be a bug conqueror?`,
        `${this.bugClicks} ${robaczekText}? That's a whole army already!`,
        `Congratulations! You've caught ${this.bugClicks} brave ${robaczekText}!`
      ];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      this.showBubbleMessage(randomMessage);
    }

    if (this.bugClicks % 10 === 0) {
      this.triggerBugRain(this.bugClicks); // Przekazujemy liczbę kliknięć
    }
  }

  getBugText(count: number): string {
    return count === 1 ? 'bug' : 'bugs';
  }

  showBubbleMessage(message: string): void {
    this.bubbleMessage = message;
    setTimeout(() => this.bubbleMessage = '', 4000);
  }

  triggerBugRain(bugCount: number): void { // Odbieramy liczbę kliknięć
    this.showRain = true;
    // Ustawiamy liczbę robaków na liczby kliknięć, 
    const numberOfBugs = Math.min(bugCount, 50); // Maksymalnie 50 robaków

    this.rainBugs = Array.from({ length: numberOfBugs }, (_, i) => ({
      id: i,
      animationClass: `anim${Math.floor(Math.random() * 5) + 1}`,
      left: Math.random() * 100,
      size: Math.random() * 40 + 60
    }));

    setTimeout(() => {
      this.showRain = false;
      this.rainBugs = [];
    }, 5000);
  }
}

