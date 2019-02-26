import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TestersRoutingModule } from './testers-routing.module';
import { TestersListComponent } from './list/testers-list.component';

@NgModule({
  declarations: [TestersListComponent],
  imports: [CommonModule, TestersRoutingModule]
})
export class TestersModule {}
