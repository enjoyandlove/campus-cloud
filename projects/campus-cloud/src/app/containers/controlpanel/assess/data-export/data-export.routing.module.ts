import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataExportListComponent } from './list/list.component';

const dataExportRoutes: Routes = [
  {
    path: '',
    component: DataExportListComponent,
    data: { zendesk: 'Data Export', amplitude: 'IGNORE' }
  }
];
@NgModule({
  imports: [RouterModule.forChild(dataExportRoutes)],
  exports: [RouterModule]
})
export class DataExportRoutingModule {}
