import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';

import { LocationsListComponent }  from './list';
import { LocationsDeleteComponent }  from './delete';
import { LocationsUpdateComponent }  from './update';

import {
  LocationsListTopBarComponent
} from './list/components';

import { LocationsService } from './locations.service';
import { LocationsRoutingModule } from './locations.routing.module';

@NgModule({
  declarations: [ LocationsListComponent, LocationsDeleteComponent, LocationsUpdateComponent,
  LocationsListTopBarComponent ],

  imports: [ CommonModule, SharedModule, LocationsRoutingModule ],

  providers: [ LocationsService ],
})
export class LocationsModule {}
