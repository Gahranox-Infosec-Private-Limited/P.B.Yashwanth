import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-coming-soon',
    templateUrl: './coming-soon.component.html',
    styleUrls: ['./coming-soon.component.css'],
    standalone: false
})
export class ComingSoonComponent implements OnInit {
  comingSoonForm: FormGroup;
  countdown: any = {};
  launchDate: Date = new Date('2024-12-31T23:59:59');
  featureName: string = '';

  constructor(private fb: FormBuilder) {
    this.comingSoonForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Get the feature name from localStorage if available
    const storedFeature = localStorage.getItem('comingSoonFeature');
    this.featureName = storedFeature || 'RASEED Premium';
    
    this.updateCountdown();
    setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  updateCountdown(): void {
    const now = new Date().getTime();
    const distance = this.launchDate.getTime() - now;

    if (distance < 0) {
      this.countdown = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
      return;
    }

    this.countdown = {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    };
  }

  onSubmit(): void {
    if (this.comingSoonForm.valid) {
      const email = this.comingSoonForm.get('email')?.value;
      console.log('Email submitted:', email);
      this.showNotification('Thank you for your interest! We\'ll notify you when we launch.');
      this.comingSoonForm.reset();
    }
  }

  get email() {
    return this.comingSoonForm.get('email');
  }

  private showNotification(message: string): void {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'coming-soon-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-bell"></i>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add show class after a delay
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 4000);
  }
}