import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

interface PremiumFeature {
  icon: string;
  text: string;
  route?: string;
}

@Component({
    selector: 'app-premium-banner',
    templateUrl: './premium-banner.component.html',
    styleUrls: ['./premium-banner.component.css'],
    standalone: false
})
export class PremiumBannerComponent {
  @Output() bannerClosed = new EventEmitter<void>();
  
  features: PremiumFeature[] = [
    {
      icon: 'fas fa-chart-line',
      text: 'Smart Analytics',
      route: '/coming-soon'
    },
    {
      icon: 'fas fa-calculator',
      text: 'Auto-GST',
      route: '/coming-soon'
    },
    {
      icon: 'fas fa-robot',
      text: 'AI Reports',
      route: '/coming-soon'
    }
  ];

  showModal = true; // Controls modal visibility

  constructor(private router: Router) {}

  /**
   * Close banner when user clicks "Maybe Later"
   */
  closeBanner(): void {
    this.showModal = false;
    this.bannerClosed.emit();
  }

  /**
   * Keep premium modal open and explore features
   */
  keepPremium(): void {
    // User wants to explore premium features
    // You can add navigation or additional logic here
    console.log('User wants to explore premium features');
    
    // Optional: Add upgrade flow initiation here
    // this.initiateUpgradeFlow();
  }

  /**
   * Handle feature click - navigate to coming soon page
   */
  onFeatureClick(feature: PremiumFeature): void {
    if (feature.route) {
      // Store the specific feature name for the coming soon page
      localStorage.setItem('comingSoonFeature', feature.text);
      this.router.navigate([feature.route]);
      
      // Close the modal when navigating to feature
      this.showModal = false;
      this.bannerClosed.emit();
    }
  }

  /**
   * Optional: Initiate upgrade flow
   */
  private initiateUpgradeFlow(): void {
    // Add your premium upgrade logic here
    // Example: Navigate to pricing page or open checkout modal
    console.log('Initiating premium upgrade flow...');
    
    // Example navigation:
    // this.router.navigate(['/pricing']);
    
    // Example modal opening:
    // this.openCheckoutModal();
  }

  /**
   * Optional: Open checkout modal
   */
  private openCheckoutModal(): void {
    // Implement your checkout modal logic here
    console.log('Opening checkout modal...');
  }

  /**
   * Prevent modal from closing when clicking inside content
   */
  onModalClick(event: Event): void {
    event.stopPropagation();
  }
}