import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../../../shared/shared.module';

import { PersonasListComponent } from './list';
import { PersonasEditComponent } from './edit';
import { PersonasService } from './personas.service';
import { PersonasUtilsService } from './personas.utils.service';
import { PersonasRoutingModule } from './personas.routing.module';
import { PersonasListActionBoxComponent } from './list/components';
import { PersonasCreateComponent } from './create/create.component';
import { PersonasFormComponent } from './components/personas-form/personas-form.component';

@NgModule({
  declarations: [
    PersonasListComponent,
    PersonasListActionBoxComponent,
    PersonasCreateComponent,
    PersonasFormComponent,
    PersonasEditComponent
  ],

  imports: [CommonModule, SharedModule, RouterModule, ReactiveFormsModule, PersonasRoutingModule],

  providers: [PersonasService, PersonasUtilsService]
})
export class PersonasModule {}
