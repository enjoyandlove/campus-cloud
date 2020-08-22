import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { pageTitle } from '@campus-cloud/shared/constants';
import { ExposureNotificationListComponent } from '@controlpanel/contact-trace/exposure-notification/list';
import { ExposureNotificationEditComponent } from '@controlpanel/contact-trace/exposure-notification/edit';

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
  },
  {
    path: 'edit/:notificationId',
    data: {
      zendesk: 'exposure notification',
      amplitude: 'IGNORE',
      title: pageTitle.CONTACT_TRACE_EXPOSURE_NOTIFICATION
    },
    component: ExposureNotificationEditComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class ExposureNotificationRoutingModule {}
