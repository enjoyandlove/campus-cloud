import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactTraceComponent } from './contact-trace.component';
import { ContactTraceRoutingModule } from './contact-trace.routing.module';
import { ManageHeaderService } from '@controlpanel/manage/utils';
import { HealthPassService } from '@controlpanel/contact-trace/health-pass/services/health-pass.service';

@NgModule({
  declarations: [ContactTraceComponent],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, ContactTraceRoutingModule],
  providers: [ManageHeaderService, HealthPassService]
})
export class ContactTraceModule {}
