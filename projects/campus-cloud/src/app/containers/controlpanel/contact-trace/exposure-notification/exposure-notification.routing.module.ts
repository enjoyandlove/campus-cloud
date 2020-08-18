import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { pageTitle } from '@campus-cloud/shared/constants';
import { ExposureNotificationListComponent } from '@controlpanel/contact-trace/exposure-notification/list';

// ToDo: PJ: Revisit complete code on this page including zendesk, pagetitle, AMPLITUDE

const appRoutes: Routes = [
  {
    path: '',
    data: {
      zendesk: 'exposure notification',
      title: pageTitle.CONTACT_TRACE_EXPOSURE_NOTIFICATION,
      amplitude: 'IGNORE'
    },
    component: ExposureNotificationListComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class ExposureNotificationRoutingModule {}
