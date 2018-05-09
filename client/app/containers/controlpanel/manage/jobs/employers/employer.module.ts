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
import { SharedModule } from '../../../../../shared/shared.module';

@NgModule({
  declarations: [
    EmployerListComponent,
    EmployerFormComponent,
    EmployerEditComponent,
    EmployerDeleteComponent,
    EmployerCreateComponent,
    EmployerActionBoxComponent
  ],
  imports: [SharedModule, CommonModule, ReactiveFormsModule, EmployerRoutingModule],
  exports: [EmployerFormComponent],
  providers: [EmployerService]
})
export class EmployerModule {}
