import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

import { SettingsComponent } from './settings.component';

import { SettingsRoutingModule } from './settings.routing.module';

@NgModule({
    declarations: [ SettingsComponent ],

    imports: [ CommonModule, SharedModule, SettingsRoutingModule ],

    providers: [ ],
})
export class SettingsModule {}
