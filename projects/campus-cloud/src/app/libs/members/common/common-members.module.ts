import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  LibsMembersFormComponent,
  LibsMembersListComponent,
  MembersActionBoxComponent
} from './components';

import { MemberTypeToLabelPipe } from './pipes';
import { SharedModule } from '@campus-cloud/src/app/shared/shared.module';

@NgModule({
  declarations: [
    MembersActionBoxComponent,
    LibsMembersListComponent,
    LibsMembersFormComponent,
    MemberTypeToLabelPipe
  ],
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  exports: [MembersActionBoxComponent, LibsMembersListComponent, LibsMembersFormComponent],
  providers: []
})
export class LibsCommmonMembersModule {}
