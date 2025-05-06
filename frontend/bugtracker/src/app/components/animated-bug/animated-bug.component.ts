import { Component } from '@angular/core';

@Component({
  selector: 'app-animated-bug',
  standalone: false,
  templateUrl: './animated-bug.component.html',
  styleUrl: './animated-bug.component.css'
})
export class AnimatedBugComponent {
  bugClicks = 0;
  isShaking = false;
  bubbleMessage = '';

  onBugClick(): void {
    this.bugClicks++;
    console.log(`Kliknięcia w robaczka: ${this.bugClicks}`);

    // RESET animacji: najpierw wyłącz, potem załącz
    this.isShaking = false;
    setTimeout(() => {
      this.isShaking = true;

      // Animacja trwa np. 3 sekundy
      setTimeout(() => {
        this.isShaking = false;
      }, 3000);

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
  }

  getBugText(count: number): string {
    if (count === 1) {
      return 'bug'; // Singular form for count = 1
    }
    return 'bugs'; // Plural form for any count other than 1
  }

  showBubbleMessage(message: string): void {
    this.bubbleMessage = message;
    setTimeout(() => {
      this.bubbleMessage = '';
    }, 4000);
  }
}
