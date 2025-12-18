import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingFlowComponent } from './components/billing-flow/billing-flow.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';

const routes: Routes = [
  { path: '', component: BillingFlowComponent, pathMatch: 'full' },
  { path: 'coming-soon', component: ComingSoonComponent },
  { path: '**', redirectTo: '' } // Wildcard route redirects to billing flow
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }