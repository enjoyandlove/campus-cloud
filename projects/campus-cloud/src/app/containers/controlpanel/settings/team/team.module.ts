import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { TeamListComponent } from './list';
import { TeamEditComponent } from './edit';
import { TeamDeleteComponent } from './delete';
import { TeamCreateComponent } from './create';
import { TeamUtilsService } from './team.utils.service';
import { TeamUnauthorizedComponent } from './unauthorized';
import { AdminService } from '../../../../shared/services';
import { ClubsService } from '../../manage/clubs/clubs.service';
import { SharedModule } from '../../../../shared/shared.module';
import { ServicesService } from '../../manage/services/services.service';

import {
  TeamFilterPipe,
  TeamSelectedPipe,
  TeamProfileFormComponent,
  TeamPrivilegesFormComponent,
  BaseTeamSelectModalComponent,
  SelectTeamClubsModalComponent,
  TeamSelectModalPermissionPipe,
  SelectTeamServicesModalComponent,
  SelectTeamAthleticsModalComponent
} from './components';

import { TeamRoutingModule } from './team.routing.module';

@NgModule({
  declarations: [
    TeamFilterPipe,
    TeamSelectedPipe,
    TeamListComponent,
    TeamEditComponent,
    TeamCreateComponent,
    TeamDeleteComponent,
    TeamProfileFormComponent,
    TeamUnauthorizedComponent,
    TeamPrivilegesFormComponent,
    BaseTeamSelectModalComponent,
    TeamSelectModalPermissionPipe,
    SelectTeamClubsModalComponent,
    SelectTeamServicesModalComponent,
    SelectTeamAthleticsModalComponent
  ],

  imports: [CommonModule, SharedModule, RouterModule, ReactiveFormsModule, TeamRoutingModule],

  providers: [ServicesService, ClubsService, AdminService, TeamUtilsService]
})
export class TeamModule {}
