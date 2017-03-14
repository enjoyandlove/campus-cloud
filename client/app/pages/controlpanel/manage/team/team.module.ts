import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import { TeamListComponent } from './list';
import { TeamCreateComponent } from './create';

import { TeamRoutingModule } from './team.routing.module';

@NgModule({
  declarations: [ TeamListComponent, TeamCreateComponent ],

  imports: [ CommonModule, SharedModule, RouterModule, ReactiveFormsModule, TeamRoutingModule ],

  providers: [ ],
})
export class TeamModule {}
