/*tslint:disable:max-line-length */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AudienceListComponent } from './list';
import { AuidenceEditComponent } from './edit';
import { AudienceImportComponent } from './import';
import { AduienceCreateComponent } from './create';
import { AudienceDeleteComponent } from './delete';
import { AudienceComponent } from './audience.component';
import { SharedModule } from '../../../shared/shared.module';
import { AudienceListActionBoxComponent } from './list/components';

import { AudienceService } from './audience.service';
import { AudienceRoutingModule } from './audience.routing.module';
import { AudienceSharedModule } from './shared/audience.shared.module';

@NgModule({
  declarations: [
    AudienceComponent,
    AudienceListComponent,
    AudienceListActionBoxComponent,
    AudienceDeleteComponent,
    AduienceCreateComponent,
    AuidenceEditComponent,
    AudienceImportComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    AudienceSharedModule,
    AudienceRoutingModule,
    ReactiveFormsModule
  ],

  exports: [AudienceImportComponent],

  providers: [AudienceService]
})
export class AudienceModule {}
