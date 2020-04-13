import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../shared/shared.module';
import { CampusAppManagementComponent } from './campus-app-management.component';
import { CampusAppManagementRoutingModule } from './campus-app-management.routing.module';

@NgModule({
  declarations: [CampusAppManagementComponent],

  imports: [CommonModule, SharedModule, CampusAppManagementRoutingModule],

  providers: []
})
export class CampusAppManagementModule {}
