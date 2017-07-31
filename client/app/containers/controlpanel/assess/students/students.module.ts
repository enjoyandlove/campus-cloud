import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import { EngagementStudentsListComponent } from './list';

// import { EngagementComponent } from './engagement.component';


// import { EngagementService } from './engagement.service';
import { EngagementStudentsRoutingModule } from './students.routing.module';

@NgModule({
  declarations: [ EngagementStudentsListComponent ],

  imports: [ ReactiveFormsModule, CommonModule, SharedModule, EngagementStudentsRoutingModule ],

  // providers: [ EngagementService ],
})
export class EngagementStudentsModule {}
