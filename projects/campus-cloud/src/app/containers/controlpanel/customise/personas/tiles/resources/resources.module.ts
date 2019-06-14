import { SortablejsModule } from 'angular-sortablejs';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  PersonasResourceListFormComponent,
  PersonasResourceListOfListComponent,
  PersonasResourceExternalAppOpenComponent
} from './components';

import { ResourceService } from './resource.service';
import { PersonaResourceEditComponent } from './edit';
import { TilesUtilsService } from '../tiles.utils.service';
import { LibsStudioModule } from '@campus-cloud/libs/studio/studio.module';
import { ResourcesUtilsService } from './resources.utils.service';
import { SharedModule } from '../../../../../../shared/shared.module';
import { PersonaResourceCreateComponent } from './create/create.component';

@NgModule({
  declarations: [
    PersonaResourceEditComponent,
    PersonaResourceCreateComponent,
    PersonasResourceListFormComponent,
    PersonasResourceListOfListComponent,
    PersonasResourceExternalAppOpenComponent
  ],
  imports: [CommonModule, LibsStudioModule, SharedModule, ReactiveFormsModule, SortablejsModule],
  providers: [TilesUtilsService, ResourceService, ResourcesUtilsService],
  exports: [
    PersonaResourceEditComponent,
    PersonaResourceCreateComponent,
    PersonasResourceListFormComponent,
    PersonasResourceListOfListComponent,
    PersonasResourceExternalAppOpenComponent
  ]
})
export class PersonasResourceModule {}
