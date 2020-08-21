import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PrivilegesGuard } from '@campus-cloud/config/guards';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { ContactTraceComponent } from './contact-trace.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'forms', pathMatch: 'full' },

  {
    path: '',
    component: ContactTraceComponent,
    data: { amplitude: 'IGNORE' },
    children: [
      {
        path: 'cases',
        canActivate: [PrivilegesGuard],
        data: {
          zendesk: 'cases',
          amplitude: 'Cases',
          privilege: CP_PRIVILEGES_MAP.contact_trace_cases
        },
        loadChildren: () => import('./cases/cases.module').then((m) => m.CasesModule)
      },
      {
        path: 'forms',
        canActivate: [PrivilegesGuard],
        data: {
          zendesk: 'forms',
          amplitude: 'Forms',
          privilege: CP_PRIVILEGES_MAP.contact_trace_forms
        },
        loadChildren: () => import('./forms/forms.module').then((m) => m.CTFormsModule)
      },
      {
        path: 'qr',
        canActivate: [PrivilegesGuard],
        data: {
          zendesk: 'qr',
          amplitude: 'Qr',
          privilege: CP_PRIVILEGES_MAP.contact_trace_qr
        },
        loadChildren: () => import('./qr/qr.module').then((m) => m.QrModule)
      },
      {
        path: 'health-pass',
        canActivate: [PrivilegesGuard],
        data: {
          zendesk: 'health-pass',
          amplitude: 'Health Pass',
          privilege: CP_PRIVILEGES_MAP.contact_trace_forms
        },
        loadChildren: () =>
          import('./health-pass/health-pass.module').then((m) => m.HealthPassModule)
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class ContactTraceRoutingModule {}
