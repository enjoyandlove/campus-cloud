import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CP_PRIVILEGES_MAP, pageTitle } from '@campus-cloud/shared/constants';
import { PrivilegesGuard } from '@campus-cloud/config/guards';
import { CasesComponent } from './cases.component';
import { CaseDetailsComponent } from './details';
import { CasesExcelComponent } from './excel';
import { SwitchSchoolGuard } from '@controlpanel/contact-trace/cases/switch-school.guard';

const appRoutes: Routes = [
  {
    path: '',
    component: CasesComponent,
    data: { zendesk: 'cases', amplitude: 'IGNORE', title: pageTitle.CONTACT_TRACE_SETTINGS,
      privilege: CP_PRIVILEGES_MAP.contact_trace_cases }
  },
  {
    path: ':caseId',
    canActivate: [SwitchSchoolGuard, PrivilegesGuard],
    component: CaseDetailsComponent,
    data: { zendesk: 'cases', amplitude: 'IGNORE', title: pageTitle.CONTACT_TRACE_CASES }
  },
  {
    path: 'caseInfo/:userId',
    canActivate: [PrivilegesGuard],
    component: CaseDetailsComponent,
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
