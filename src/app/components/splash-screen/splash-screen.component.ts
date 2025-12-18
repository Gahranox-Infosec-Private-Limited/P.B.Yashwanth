import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-splash-screen',
    templateUrl: './splash-screen.component.html',
    styleUrls: ['./splash-screen.component.css'],
    standalone: false
})
export class SplashScreenComponent implements OnInit {
  @Output() splashComplete = new EventEmitter<void>();
  
  isLoading = true;
  progressValue = 0;
  loadingText = 'Initializing your billing workspace...';
  version = 'v1.0';

  ngOnInit() {
    this.startLoadingAnimation();
    
    // Simulate loading process with different texts
    const loadingStages = [
      { time: 500, text: 'Loading billing modules...' },
      { time: 1000, text: 'Setting up GST calculator...' },
      { time: 1500, text: 'Preparing your workspace...' },
      { time: 2000, text: 'Almost ready...' }
    ];

    loadingStages.forEach(stage => {
      setTimeout(() => {
        this.loadingText = stage.text;
      }, stage.time);
    });

    // Auto hide after 3 seconds
    setTimeout(() => {
      this.hideSplash();
    }, 3000);
  }

  private startLoadingAnimation(): void {
    const interval = setInterval(() => {
      this.progressValue += 10;
      if (this.progressValue >= 100) {
        this.progressValue = 100;
        clearInterval(interval);
        this.loadingText = 'Ready!';
      }
    }, 300);
  }

  hideSplash(): void {
    this.isLoading = false;
    
    // Add fade-out class for smooth exit
    const splash = document.querySelector('.splash-container');
    if (splash) {
      splash.classList.add('fade-out');
      
      // Remove from DOM after animation completes
      setTimeout(() => {
        this.splashComplete.emit();
      }, 500);
    } else {
      this.splashComplete.emit();
    }
  }

  // Optional: Manual skip method (can be triggered by click/tap)
  skipSplash(): void {
    if (this.isLoading) {
      this.hideSplash();
    }
  }
}