import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupComponent, GroupItemComponent } from './components';

@NgModule({
  exports: [GroupComponent, GroupItemComponent],
  declarations: [GroupComponent, GroupItemComponent],
  imports: [CommonModule]
})
export class GroupModule {}
