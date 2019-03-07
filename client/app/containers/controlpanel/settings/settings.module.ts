import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings.routing.module';
import { CampusTestersModule } from './testers/campus-testers.module';

@NgModule({
  declarations: [SettingsComponent],

  imports: [CommonModule, SharedModule, SettingsRoutingModule, CampusTestersModule],

  providers: []
})
export class SettingsModule {}
