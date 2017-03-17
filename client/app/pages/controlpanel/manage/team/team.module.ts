import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import { TeamListComponent } from './list';
import { TeamCreateComponent } from './create';

import { ClubsService } from '../clubs/clubs.service';
import { ServicesService } from '../services/services.service';

import {
  TeamFilterPipe,
  TeamSelectedPipe,
  BaseTeamSelectModalComponent,
  SelectTeamClubsModalComponent,
  SelectTeamServicesModalComponent
} from './create/components';

import { TeamRoutingModule } from './team.routing.module';

@NgModule({
  declarations: [ TeamListComponent, TeamCreateComponent, BaseTeamSelectModalComponent,
  TeamSelectedPipe, TeamFilterPipe, SelectTeamServicesModalComponent,
  SelectTeamClubsModalComponent ],

  imports: [ CommonModule, SharedModule, RouterModule, ReactiveFormsModule, TeamRoutingModule ],

  providers: [ ServicesService, ClubsService ],
})
export class TeamModule {}
