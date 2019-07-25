import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@campus-cloud/shared/shared.module';
import { ResourceExternalAppOpenUtils } from './resource-external-app-open.utils.service';
import { PersonasResourceExternalAppOpenComponent } from './resource-external-app-open.component';

@NgModule({
  exports: [PersonasResourceExternalAppOpenComponent],
  declarations: [PersonasResourceExternalAppOpenComponent],
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  providers: [ResourceExternalAppOpenUtils]
})
export class ResourceExternalAppOpenModule {}
