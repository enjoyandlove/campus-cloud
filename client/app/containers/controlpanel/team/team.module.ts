import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

import { TeamListComponent } from './list';
import { TeamEditComponent } from './edit';
import { TeamDeleteComponent } from './delete';
import { TeamCreateComponent } from './create';
import { TeamUnauthorizedComponent } from './unauthorized';
import { TeamComponent } from './team.component';
import { ClubsService } from '../manage/clubs/clubs.service';
import { AdminService } from '../../../shared/services';
import { ServicesService } from '../manage/services/services.service';

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
  SelectTeamClubsModalComponent, TeamDeleteComponent, TeamEditComponent,
  TeamUnauthorizedComponent, TeamComponent ],

  imports: [ CommonModule, SharedModule, RouterModule, ReactiveFormsModule, TeamRoutingModule ],

  providers: [ ServicesService, ClubsService, AdminService ],
})
export class TeamModule {}
