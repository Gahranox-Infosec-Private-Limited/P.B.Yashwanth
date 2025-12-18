import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { PremiumBannerComponent } from './components/premium-banner/premium-banner.component';
import { BillingFlowComponent } from './components/billing-flow/billing-flow.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';

@NgModule({
  declarations: [
    AppComponent,
    SplashScreenComponent,
    PremiumBannerComponent,
    BillingFlowComponent,
    ComingSoonComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule // Import the routing module here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }