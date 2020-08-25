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
import { NotificationTemplateEditComponent } from '@controlpanel/contact-trace/health-pass/notification-templates/edit';
import { EffectsModule } from '@ngrx/effects';
import { HealthPassApiEffects } from '@controlpanel/contact-trace/health-pass/store/effects/health-pass-api.effects';
import { StoreModule } from '@ngrx/store';
import { reducers } from '@controlpanel/contact-trace/health-pass/store/reducers';
import { HealthPassListComponent } from '@controlpanel/contact-trace/health-pass/health-pass-list/health-pass-list.component';
import { NotificationTemplateApiEffects } from '@controlpanel/contact-trace/health-pass/store/effects/notification-template-api.effects';

@NgModule({
  declarations: [
    HealthPassComponent,
    HealthPassEditComponent,
    NotificationTemplateEditComponent,
    NotificationTemplatesComponent,
    HealthPassListComponent],
  entryComponents: [HealthPassEditComponent, NotificationTemplateEditComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    LayoutsModule,
    ReactiveFormsModule,
    HealthPassRoutingModule,
    FormsModule,
    EffectsModule.forFeature([HealthPassApiEffects, NotificationTemplateApiEffects]),
    StoreModule.forFeature('healthPassSettings', reducers)
  ],

  providers: [CPI18nPipe, AdminService, ModalService]
})
export class HealthPassModule {}
