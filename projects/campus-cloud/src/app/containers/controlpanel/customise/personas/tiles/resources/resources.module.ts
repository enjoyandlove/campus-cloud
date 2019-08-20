import { SortablejsModule } from 'angular-sortablejs';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  PersonasResourceListFormComponent,
  PersonasResourceListOfListComponent
} from './components';

import { ResourceService } from './resource.service';
import { PersonaResourceEditComponent } from './edit';
import { TilesUtilsService } from '../tiles.utils.service';
import { ResourcesUtilsService } from './resources.utils.service';
import { SharedModule } from '../../../../../../shared/shared.module';
import { LibsStudioModule } from '@campus-cloud/libs/studio/studio.module';
import { PersonaResourceCreateComponent } from './create/create.component';
import { ImageModule } from '@campus-cloud/shared/services/image/image.module';
import { TileImageValidatorService } from './components/resource-list-form/tiles.image.validator.service';

@NgModule({
  declarations: [
    PersonaResourceEditComponent,
    PersonaResourceCreateComponent,
    PersonasResourceListFormComponent,
    PersonasResourceListOfListComponent
  ],
  imports: [
    CommonModule,
    LibsStudioModule,
    SharedModule,
    ReactiveFormsModule,
    SortablejsModule,
    ImageModule.forRoot(TileImageValidatorService)
  ],
  providers: [TilesUtilsService, ResourceService, ResourcesUtilsService],
  exports: [
    PersonaResourceEditComponent,
    PersonaResourceCreateComponent,
    PersonasResourceListFormComponent,
    PersonasResourceListOfListComponent
  ]
})
export class PersonasResourceModule {}
