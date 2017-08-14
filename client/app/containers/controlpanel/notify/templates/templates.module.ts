import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import { TemplatesListComponent } from './list';

import { TemplatesRoutingModule } from './templates.routing.module';

@NgModule({
  declarations: [ TemplatesListComponent ],

  exports: [ ],

  imports: [ CommonModule, SharedModule, ReactiveFormsModule, TemplatesRoutingModule ],

  providers: [ ],
})
export class TemplatesModule {}
