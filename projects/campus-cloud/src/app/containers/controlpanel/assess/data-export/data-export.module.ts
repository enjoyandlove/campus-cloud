import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DataExportTopBarComponent } from './list/components';
import { DataExportListComponent } from './list/list.component';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { DataExportRoutingModule } from './data-export.routing.module';

@NgModule({
  declarations: [DataExportListComponent, DataExportTopBarComponent],
  imports: [CommonModule, SharedModule, DataExportRoutingModule]
})
export class DataExportModule {}
