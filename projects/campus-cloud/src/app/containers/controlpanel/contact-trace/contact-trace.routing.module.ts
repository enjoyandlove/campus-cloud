import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PrivilegesGuard } from '@campus-cloud/config/guards';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { ContactTraceComponent } from './contact-trace.component';

// ToDo: PJ: Revisit complete code on this page including what is zendesk, amplitude

const appRoutes: Routes = [
  { path: '', redirectTo: 'forms', pathMatch: 'full' },

  {
    path: '',
    component: ContactTraceComponent,
    data: { amplitude: 'IGNORE' },
    children: [
      {
        path: 'forms',
        canActivate: [PrivilegesGuard],
        data: {
          zendesk: 'forms',
          amplitude: 'Forms',
          privilege: CP_PRIVILEGES_MAP.contact_trace_forms
        },
        loadChildren: () => import('./forms/forms.module').then((m) => m.CTFormsModule)
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class ContactTraceRoutingModule {}
