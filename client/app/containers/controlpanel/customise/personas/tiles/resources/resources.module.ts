import { SortablejsModule } from 'angular-sortablejs';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  PersonasResourceFormComponent,
  PersonasResourceTypesComponent,
  PersonasResourceTypeUrlComponent,
  PersonasResourceListFormComponent,
  PersonasResourceListOfListComponent,
  PersonasResourceStoresListComponent,
  PersonasResourceTypeSearchComponent,
  PersonasResourceServiceByCategoryComponent
} from './components';

import { ResourceService } from './resource.service';
import { PersonaResourceEditComponent } from './edit';
import { TilesUtilsService } from '../tiles.utils.service';
import { ResourcesUtilsService } from './resources.utils.service';
import { SharedModule } from '../../../../../../shared/shared.module';
import { PersonaResourceCreateComponent } from './create/create.component';

@NgModule({
  declarations: [
    PersonaResourceEditComponent,
    PersonasResourceFormComponent,
    PersonaResourceCreateComponent,
    PersonasResourceTypesComponent,
    PersonasResourceTypeUrlComponent,
    PersonasResourceListFormComponent,
    PersonasResourceStoresListComponent,
    PersonasResourceTypeSearchComponent,
    PersonasResourceListOfListComponent,
    PersonasResourceServiceByCategoryComponent
  ],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, SortablejsModule],
  providers: [TilesUtilsService, ResourceService, ResourcesUtilsService],
  exports: [
    PersonaResourceEditComponent,
    PersonasResourceFormComponent,
    PersonaResourceCreateComponent,
    PersonasResourceTypesComponent,
    PersonasResourceTypeUrlComponent,
    PersonasResourceListFormComponent,
    PersonasResourceStoresListComponent,
    PersonasResourceTypeSearchComponent,
    PersonasResourceListOfListComponent,
    PersonasResourceServiceByCategoryComponent
  ]
})
export class PersonasResourceModule {}
