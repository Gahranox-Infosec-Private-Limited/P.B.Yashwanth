import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.css']
})
export class ComingSoonComponent {
  features = [
    {
      icon: '📊',
      title: 'Advanced Reports',
      description: 'Detailed analytics, charts, and business insights with export capabilities',
      progress: 75,
      eta: 'Q1 2024'
    },
    {
      icon: '🤖',
      title: 'Smart Analytics',
      description: 'AI-powered predictions, trend analysis, and automated insights',
      progress: 60,
      eta: 'Q2 2024'
    },
    {
      icon: '🔄',
      title: 'Auto Reconciliation',
      description: 'Automated GST filing and financial reconciliation',
      progress: 45,
      eta: 'Q3 2024'
    },
    {
      icon: '🌐',
      title: 'Multi-Platform Sync',
      description: 'Sync across web, mobile, and desktop applications',
      progress: 30,
      eta: 'Q4 2024'
    }
  ];

  constructor(private router: Router) {}

  backToBilling(): void {
    this.router.navigate(['/']);
  }

  getProgressWidth(progress: number): string {
    return `${progress}%`;
  }

  getProgressColor(progress: number): string {
    if (progress >= 75) return 'var(--success)';
    if (progress >= 50) return 'var(--primary)';
    if (progress >= 25) return 'var(--warning)';
    return 'var(--danger)';
  }
}