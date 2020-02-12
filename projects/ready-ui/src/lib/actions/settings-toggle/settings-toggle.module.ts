import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ToggleModule } from '../../forms/toggle/toggle.module';
import { SettingsToggleComponent } from './settings-toggle/settings-toggle.component';

@NgModule({
  exports: [SettingsToggleComponent],
  declarations: [SettingsToggleComponent],
  imports: [CommonModule, ToggleModule]
})
export class SettingsToggleModule {}
