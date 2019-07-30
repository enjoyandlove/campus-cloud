import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { CPI18nPipe } from '@campus-cloud/shared/pipes';

import {
  HelpDeskPipes,
  CPTopBarComponent,
  CPHelpDeskComponent,
  SchoolSwitchComponent
} from '@campus-cloud/shared/components';

@NgModule({
  declarations: [
    CPI18nPipe,
    HelpDeskPipes,
    CPTopBarComponent,
    CPHelpDeskComponent,
    SchoolSwitchComponent
  ],

  imports: [CommonModule, RouterModule],

  exports: [
    CPI18nPipe,
    HelpDeskPipes,
    CPTopBarComponent,
    CPHelpDeskComponent,
    SchoolSwitchComponent
  ]
})
export class CPTopBarModule {}
