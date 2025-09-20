import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { WorkflowsComponent } from './workflows/workflows';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'workflows', component: WorkflowsComponent },
  { path: '**', redirectTo: '' } // catch-all
];
