import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EditComponent } from './edit';
import { FormComponent } from './form';
import { CreateComponent } from './create';
import { DeleteComponent } from './delete';

import { CheckInUtilsService } from './check-in.utils.service';
import { SharedModule } from '../../../../../../../shared/shared.module';

@NgModule({
  declarations: [
    FormComponent,
    EditComponent,
    CreateComponent,
    DeleteComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ],

  providers: [CheckInUtilsService],

  exports: [
    FormComponent,
    EditComponent,
    CreateComponent,
    DeleteComponent
  ]
})

export class CheckInModule {}
