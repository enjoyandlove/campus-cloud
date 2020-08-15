import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { pageTitle } from '@campus-cloud/shared/constants';
import { ExposureNotificationListComponent } from '.';

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
