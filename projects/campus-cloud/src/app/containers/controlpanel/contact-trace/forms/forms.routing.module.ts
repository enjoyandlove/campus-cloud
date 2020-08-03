import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { pageTitle } from '@campus-cloud/shared/constants';
import { FormsListComponent } from './list';
import {
  FormsCreateBuilderComponent,
  FormsCreateComponent,
  FormsCreateInfoComponent
} from './create';
import { FormsCreateShareComponent } from './share';
import { FormsCreateResultsComponent } from './results';

// ToDo: PJ: Revisit complete code on this page including zendesk, pagetitle, AMPLITUDE

const appRoutes: Routes = [
  {
    path: '',
    data: { zendesk: 'forms', title: pageTitle.CONTACT_TRACE_FORMS, amplitude: 'IGNORE' },
    component: FormsListComponent
  },
  {
    path: 'edit/:formId',
    data: { zendesk: 'forms', amplitude: 'IGNORE', title: pageTitle.CONTACT_TRACE_FORMS },
    component: FormsCreateComponent,
    children: [
      {
        path: 'info',
        data: { zendesk: 'forms', amplitude: 'IGNORE', title: pageTitle.CONTACT_TRACE_FORMS },
        component: FormsCreateInfoComponent
      },
      {
        path: 'builder',
        data: { zendesk: 'forms', amplitude: 'IGNORE', title: pageTitle.CONTACT_TRACE_FORMS },
        component: FormsCreateBuilderComponent
      }
    ]
  },
  {
    path: 'share/:formId',
    data: { zendesk: 'forms', amplitude: 'IGNORE', title: pageTitle.CONTACT_TRACE_FORMS },
    component: FormsCreateShareComponent
  },
  {
    path: 'results/:formId',
    data: { zendesk: 'forms', amplitude: 'IGNORE', title: pageTitle.CONTACT_TRACE_FORMS },
    component: FormsCreateResultsComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class FormsRoutingModule {}
