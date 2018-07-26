import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  PersonasResourceFormComponent,
  PersonasResourceListOfListComponent,
  PersonasResourceServiceByCategoryComponent,
  PersonasResourceStoresListComponent,
  PersonasResourceTypesComponent,
  PersonasResourceTypeSearchComponent,
  PersonasResourceTypeUrlComponent
} from './components';
import { PersonaResourceCreateComponent } from './create/create.component';
import { ResourceService } from './resource.service';
import { ResourcesUtilsService } from './resources.utils.service';
import { SharedModule } from '../../../../../../shared/shared.module';
import { TilesUtilsService } from '../tiles.utils.service';

@NgModule({
  declarations: [
    PersonasResourceFormComponent,
    PersonaResourceCreateComponent,
    PersonasResourceTypeUrlComponent,
    PersonasResourceTypesComponent,
    PersonasResourceStoresListComponent,
    PersonasResourceTypeSearchComponent,
    PersonasResourceListOfListComponent,
    PersonasResourceServiceByCategoryComponent
  ],
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  providers: [TilesUtilsService, ResourceService, ResourcesUtilsService],
  exports: [
    PersonasResourceFormComponent,
    PersonaResourceCreateComponent,
    PersonasResourceTypeUrlComponent,
    PersonasResourceTypesComponent,
    PersonasResourceStoresListComponent,
    PersonasResourceTypeSearchComponent,
    PersonasResourceListOfListComponent,
    PersonasResourceServiceByCategoryComponent
  ]
})
export class PersonasResourceModule {}
