import { NgModule } from '@angular/core';

import { ClubsDetailsModule } from '../../clubs/details/details.module';
import { AthleticsDetailsComponent } from './athletics-details.component';
import { AthleticsInfoComponent } from '../info';
import { AthleticsWallComponent } from '../wall';

import { AthleticsDetailsRoutingModule } from './athletics-details.routing.module';

@NgModule({
  declarations: [AthleticsInfoComponent, AthleticsWallComponent, AthleticsDetailsComponent],

  imports: [AthleticsDetailsRoutingModule, ClubsDetailsModule]
})
export class AthleticsDetailsModule {}
