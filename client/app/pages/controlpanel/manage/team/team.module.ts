import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import { TeamListComponent } from './list';
import { TeamEditComponent } from './edit';
import { TeamDeleteComponent } from './delete';
import { TeamCreateComponent } from './create';
import { TeamErrorModalComponent } from './error';

import { ClubsService } from '../clubs/clubs.service';
import { AdminService } from '../../../../shared/services';
import { ServicesService } from '../services/services.service';

import { TeamService } from './team.service';

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
  SelectTeamClubsModalComponent, TeamDeleteComponent, TeamEditComponent, TeamErrorModalComponent ],

  imports: [ CommonModule, SharedModule, RouterModule, ReactiveFormsModule, TeamRoutingModule ],

  providers: [ ServicesService, ClubsService, AdminService, TeamService ],
})
export class TeamModule {}
