import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { SettingsComponent } from './settings.component';
import { TestersModule } from './testers/testers.module';
import { SettingsRoutingModule } from './settings.routing.module';
import { CampusTestersModule } from './testers/campus-testers.module';

@NgModule({
  declarations: [SettingsComponent],

  imports: [CommonModule, SharedModule, SettingsRoutingModule, TestersModule],

  providers: []
})
export class SettingsModule {}
