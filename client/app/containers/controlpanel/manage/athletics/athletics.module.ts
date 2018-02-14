import { NgModule } from '@angular/core';

import { AthleticsListComponent } from './list';
import { AthleticsCreateComponent } from './create';
import { AthleticsDeleteComponent } from './delete';
import { AthleticsExcelComponent } from './excel';
import { AthleticsEditComponent } from './edit';
import { AthleticsRoutingModule } from './athletics.routing.module';

import { ClubsModule } from '../clubs/clubs.module';

@NgModule({
  declarations: [
    AthleticsListComponent,
    AthleticsEditComponent,
    AthleticsExcelComponent,
    AthleticsCreateComponent,
    AthleticsDeleteComponent,
  ],

  imports: [
    AthleticsRoutingModule,
    ClubsModule
  ],

})
export class AthleticsModule {}
