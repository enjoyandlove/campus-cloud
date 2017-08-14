import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import { TemplatesListComponent } from './list';

import { TemplatesTopBarComponent } from './list/components';

import { TemplatesRoutingModule } from './templates.routing.module';

import { TemplatesService } from './templates.service';

@NgModule({
  declarations: [ TemplatesListComponent, TemplatesTopBarComponent ],

  exports: [ ],

  imports: [ CommonModule, SharedModule, ReactiveFormsModule, TemplatesRoutingModule ],

  providers: [ TemplatesService ],
})
export class TemplatesModule {}
