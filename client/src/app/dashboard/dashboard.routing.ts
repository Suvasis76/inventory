import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { RouteGuardService } from '../services/route-guard.service';  // ✅ Import Route Guard

export const DashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [RouteGuardService],  // ✅ Apply Route Guard
    data: { expectedRole: ['admin', 'user'] }  // ✅ Define allowed roles
  }
];

