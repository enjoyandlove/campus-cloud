import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import { ClubsService } from './clubs.service';

@NgModule({
  declarations: [ ],

  imports: [ CommonModule, SharedModule, RouterModule, ReactiveFormsModule ],

  providers: [ ClubsService ],
})
export class ClubsModule {}
