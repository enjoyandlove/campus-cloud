import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AudienceListComponent } from './list';
import { AuidenceEditComponent } from './edit';
import { AudienceImportComponent } from './import';
import { AudienceCreateComponent } from './create';
import { AudienceDeleteComponent } from './delete';
import { AudienceComponent } from './audience.component';
import { SharedModule } from '../../../shared/shared.module';
import { AudienceListActionBoxComponent } from './list/components';

import { AudienceService } from './audience.service';
import { AudienceRoutingModule } from './audience.routing.module';
import { AudienceSharedModule } from './shared/audience.shared.module';
import { AudienceUtilsService } from './audience.utils.service';

@NgModule({
  declarations: [
    AudienceComponent,
    AudienceListComponent,
    AudienceListActionBoxComponent,
    AudienceDeleteComponent,
    AudienceCreateComponent,
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

  providers: [AudienceService, AudienceUtilsService]
})
export class AudienceModule {}
