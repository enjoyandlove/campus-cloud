import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssessComponent } from './assess.component';
import { AssessUtilsService } from './assess.utils.service';
import { SharedModule } from '../../../shared/shared.module';
import { AssessRoutingModule } from './assess.routing.module';

@NgModule({
  declarations: [AssessComponent],

  imports: [CommonModule, SharedModule, AssessRoutingModule],

  providers: [AssessUtilsService]
})
export class AssessModule {}
