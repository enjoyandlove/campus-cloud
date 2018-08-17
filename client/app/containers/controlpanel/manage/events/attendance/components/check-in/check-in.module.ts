import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CheckInEditComponent } from './edit';
import { CheckInFormComponent } from './form';
import { CheckInCreateComponent } from './create';
import { CheckInDeleteComponent } from './delete';

import { CheckInUtilsService } from './check-in.utils.service';
import { SharedModule } from '../../../../../../../shared/shared.module';

@NgModule({
  declarations: [
    CheckInFormComponent,
    CheckInEditComponent,
    CheckInCreateComponent,
    CheckInDeleteComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ],

  providers: [CheckInUtilsService],

  exports: [
    CheckInFormComponent,
    CheckInEditComponent,
    CheckInCreateComponent,
    CheckInDeleteComponent
  ]
})

export class CheckInModule {}
