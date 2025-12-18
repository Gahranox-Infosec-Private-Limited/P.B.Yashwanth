import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent {
  isLoading = true;
  showPremiumBanner = true;

  ngOnInit() {
    // Simulate app loading only - NO AUTO-CLOSE TIMER
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }

  closePremiumBanner() {
    this.showPremiumBanner = false;
  }
}