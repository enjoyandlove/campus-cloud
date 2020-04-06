import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { EmployerListComponent } from './list';
import { EmployerEditComponent } from './edit';
import { EmployerCreateComponent } from './create';
import { EmployerDeleteComponent } from './delete';
import { EmployerFormComponent } from './components/employer-form';
import { EmployerActionBoxComponent } from './list/components/action-box';

import { EmployerService } from './employer.service';
import { EmployerRoutingModule } from './employer.routing.module';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { ImageService, ImageValidatorService } from '@campus-cloud/shared/services';

@NgModule({
  declarations: [
    EmployerListComponent,
    EmployerFormComponent,
    EmployerEditComponent,
    EmployerDeleteComponent,
    EmployerCreateComponent,
    EmployerActionBoxComponent
  ],
  entryComponents: [EmployerCreateComponent, EmployerEditComponent, EmployerDeleteComponent],
  imports: [SharedModule, CommonModule, ReactiveFormsModule, EmployerRoutingModule],
  exports: [EmployerFormComponent],
  providers: [EmployerService, ImageService, ImageValidatorService]
})
export class EmployerModule {}
