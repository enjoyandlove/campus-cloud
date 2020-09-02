import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { reducers, effects } from './store';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { LayoutsModule } from '@campus-cloud/layouts/layouts.module';
import { EngagementModule } from '@controlpanel/assess/engagement/engagement.module';
import { CasesRoutingModule } from './cases.routing.module';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';

import { ModalService, AdminService } from '@campus-cloud/shared/services';

import { CasesComponent } from './cases.component';
import { CasesListActionBoxComponent, CaseTotalCountViewComponent } from './list/components';
import { CaseCreateComponent } from './create/case-create.component';
import { CaseFormComponent } from './form/case-form.component';
import { CasesUtilsService } from './cases.utils.service';
import { CasesService } from './cases.service';
import { CasesListComponent } from './list';
import { CaseDetailsComponent } from './details';
import {
  CaseViewComponent,
  CaseLogComponent,
  NoteViewComponent,
  CaseEventViewComponent
} from './details/components';
import { CasesExcelModalComponent, CasesImportTopBarComponent } from './excel/components';
import { CasesExcelComponent } from './excel';
import { CaseDeleteComponent } from './delete';
import { SwitchSchoolGuard } from '@controlpanel/contact-trace/cases/switch-school.guard';

@NgModule({
  declarations: [
    CasesComponent,
    CasesListActionBoxComponent,
    CasesListComponent,
    CaseCreateComponent,
    CaseFormComponent,
    CaseDetailsComponent,
    CaseViewComponent,
    CaseTotalCountViewComponent,
    CasesExcelModalComponent,
    CasesImportTopBarComponent,
    CasesExcelComponent,
    CaseDeleteComponent,
    CaseLogComponent,
    NoteViewComponent,
    CaseEventViewComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    LayoutsModule,
    ReactiveFormsModule,
    CasesRoutingModule,
    FormsModule,
    EngagementModule,
    EffectsModule.forFeature(effects),
    StoreModule.forFeature('casesModule', reducers)
  ],

  providers: [CPI18nPipe, AdminService, ModalService, CasesService, CasesUtilsService, SwitchSchoolGuard]
})
export class CasesModule {}
