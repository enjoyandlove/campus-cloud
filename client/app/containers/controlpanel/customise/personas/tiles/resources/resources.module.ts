import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TilesUtilsService } from '../tiles.utils.service';
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
import { SharedModule } from '../../../../../../shared/shared.module';

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
  providers: [TilesUtilsService, ResourceService],
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
