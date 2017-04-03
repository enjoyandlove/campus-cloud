import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../../shared/shared.module';

/**
 * CRUD
 */
import { ClubsMembersComponent } from './list';

// import { ClubsService } from './members.service';
import { ClubsMembersRoutingModule } from './members.routing.module';

@NgModule({
  declarations: [ ClubsMembersComponent ],

  imports: [ CommonModule, SharedModule, RouterModule, ReactiveFormsModule,
  ClubsMembersRoutingModule ],

  providers: [ ],
})
export class ClubsMembersModule {}
