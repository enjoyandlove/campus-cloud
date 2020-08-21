import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AdminService, ModalService } from '@campus-cloud/shared/services';

import { SharedModule } from '@campus-cloud/shared/shared.module';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { LayoutsModule } from '@campus-cloud/layouts/layouts.module';

import { HealthPassComponent } from './health-pass.component';
import { HealthPassRoutingModule } from './health-pass.routing.module';
import { HealthPassEditComponent } from '@controlpanel/contact-trace/health-pass/edit/health-pass-edit.component';
import { NotificationTemplatesComponent } from '@controlpanel/contact-trace/health-pass/notification-templates';
import { MatDialogModule } from '@angular/material';
import { NotificationTemplateEditComponent } from '@controlpanel/contact-trace/health-pass/notification-templates/edit';

@NgModule({
  declarations: [HealthPassComponent, HealthPassEditComponent, NotificationTemplateEditComponent, NotificationTemplatesComponent],
  entryComponents: [HealthPassEditComponent, NotificationTemplateEditComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    LayoutsModule,
    ReactiveFormsModule,
    HealthPassRoutingModule,
    FormsModule,
    MatDialogModule
  ],

  providers: [CPI18nPipe, AdminService, ModalService]
})
export class HealthPassModule {}
