import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import { LinksListComponent } from './list';
import { LinksEditComponent } from './edit';
import { LinksCreateComponent } from './create';
import { LinksDeleteComponent } from './delete';

import { LinksService } from './links.service';
import { LinksRoutingModule } from './links.routing.module';

import { LinksListActionBoxComponent } from './list/components';

@NgModule({
  entryComponents: [LinksEditComponent, LinksCreateComponent, LinksDeleteComponent],
  declarations: [
    LinksListActionBoxComponent,
    LinksListComponent,
    LinksEditComponent,
    LinksDeleteComponent,
    LinksCreateComponent
  ],

  imports: [CommonModule, SharedModule, RouterModule, ReactiveFormsModule, LinksRoutingModule],

  providers: [LinksService]
})
export class LinksModule {}
