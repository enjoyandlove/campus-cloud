import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { TermsOfUsePipe } from './pipes';
import { CommonModule } from '@angular/common';
import { TermsOfUseCreateComponent } from './create';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { LayoutsModule } from '@campus-cloud/layouts/layouts.module';
import { TermsOfUseRoutingModule } from './terms-of-use.routing.module';
import { CampusAppTermsOfUseComponent, PublishTermsModalComponent } from './components';

@NgModule({
  declarations: [
    TermsOfUsePipe,
    TermsOfUseCreateComponent,
    PublishTermsModalComponent,
    CampusAppTermsOfUseComponent
  ],

  entryComponents: [PublishTermsModalComponent],

  imports: [
    CommonModule,
    SharedModule,
    LayoutsModule,
    ReactiveFormsModule,
    TermsOfUseRoutingModule
  ],

  providers: [TermsOfUsePipe]
})
export class TermsOfUseModule {}
