/*tslint:disable:max-line-length*/
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from './../../../../shared/shared.module';
import { AudienceCardComponent } from './audience-card/audience-card.component';
import { AudienceCustomComponent } from './audience-custom/audience-custom.component';
import { AudienceDynamicComponent } from './audience-dynamic/audience-dynamic.component';
import { AudienceCounterComponent } from './audience-counter/audience-counter.component';
import { AudienceNewBodyComponent } from './audience-new-body/audience-new-body.component';

import { AudienceSaveModalComponent } from './audience-save-modal/audience-save-modal.component';
import { AudienceSavedBodyComponent } from './audience-saved-body/audience-saved-body.component';
import { AudienceUsersTypeaheadComponent } from './audience-users-typeahead/audience-users-typeahead.component';
import { AudienceService } from './../../../../containers/controlpanel/audience/audience.service';

@NgModule({
  declarations: [
    AudienceCardComponent,
    AudienceCustomComponent,
    AudienceCounterComponent,
    AudienceNewBodyComponent,
    AudienceDynamicComponent,
    AudienceSavedBodyComponent,
    AudienceSaveModalComponent,
    AudienceUsersTypeaheadComponent
  ],

  imports: [CommonModule, SharedModule, ReactiveFormsModule],

  providers: [AudienceService],

  exports: [
    AudienceCardComponent,
    AudienceCustomComponent,
    AudienceCounterComponent,
    AudienceNewBodyComponent,
    AudienceSavedBodyComponent,
    AudienceUsersTypeaheadComponent
  ]
})
export class AudienceSharedModule {}
