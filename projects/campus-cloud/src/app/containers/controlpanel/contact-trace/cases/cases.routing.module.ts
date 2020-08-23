import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { pageTitle } from '@campus-cloud/shared/constants';
import { PrivilegesGuard } from '@campus-cloud/config/guards';
import { CasesComponent } from './cases.component';
import { CasesExcelComponent } from './excel';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [PrivilegesGuard],
    component: CasesComponent,
    data: { zendesk: 'cases', amplitude: 'IGNORE', title: pageTitle.CONTACT_TRACE_CASES }
  },
  {
    path: 'import/excel',
    component: CasesExcelComponent,
    data: { zendesk: 'cases', amplitude: 'IGNORE', title: pageTitle.CONTACT_TRACE_CASES }
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class CasesRoutingModule {}
