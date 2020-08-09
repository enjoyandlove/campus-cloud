import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QrComponent } from './qr.component';
import { QrExcelComponent } from './excel';
import { pageTitle } from '@campus-cloud/shared/constants';
import { PrivilegesGuard } from '@campus-cloud/config/guards';
import { QrDetailsComponent } from './details';

const appRoutes: Routes = [
  { path: 'import', redirectTo: '', pathMatch: 'full' },
  {
    path: '',
    canActivate: [PrivilegesGuard],
    component: QrComponent,
    data: { zendesk: 'qr', amplitude: 'IGNORE', title: pageTitle.CONTACT_TRACE_QR }
  },
  {
    path: ':providerId',
    canActivate: [PrivilegesGuard],
    component: QrDetailsComponent,
    data: { zendesk: 'qr', amplitude: 'IGNORE', title: pageTitle.CONTACT_TRACE_QR }
  },
  {
    path: 'import/excel',
    canActivate: [PrivilegesGuard],
    component: QrExcelComponent,
    data: { zendesk: 'qr', amplitude: 'IGNORE', title: pageTitle.CONTACT_TRACE_QR }
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class QrRoutingModule {}
