import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { TermsOfUseCreateComponent } from './create';

const appRoutes: Routes = [
  {
    path: '',
    component: TermsOfUseCreateComponent,
    data: {
      zendesk: 'Terms of Use',
      amplitude: 'Terms of Use'
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
  providers: []
})
export class TermsOfUseRoutingModule {}
