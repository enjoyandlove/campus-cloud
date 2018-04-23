/*tslint:disable:max-line-length*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../../../../shared/shared.module';

import { AudienceService } from './../../../../containers/controlpanel/audience/audience.service';

import { AudienceSavedBodyComponent } from './audience-saved-body/audience-saved-body.component';
import { AudienceUsersTypeaheadComponent } from './audience-users-typeahead/audience-users-typeahead.component';
import { AudienceCardComponent } from './audience-card/audience-card.component';
import { AudienceCustomComponent } from './audience-custom/audience-custom.component';
import { AudienceCounterComponent } from './audience-counter/audience-counter.component';
import { AudienceNewBodyComponent } from './audience-new-body/audience-new-body.component';

@NgModule({
  declarations: [
    AudienceCardComponent,
    AudienceCustomComponent,
    AudienceCounterComponent,
    AudienceNewBodyComponent,
    AudienceSavedBodyComponent,
    AudienceUsersTypeaheadComponent
  ],

  imports: [CommonModule, SharedModule],

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
