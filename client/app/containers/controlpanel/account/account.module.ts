import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

import { AccountService } from './account.service';
import { ChangePasswordComponent } from './change-password';
import { AccountRoutingModule } from './account.routing.module';

@NgModule({
  declarations: [ChangePasswordComponent],

  imports: [CommonModule, RouterModule, ReactiveFormsModule, SharedModule, AccountRoutingModule],

  providers: [AccountService]
})
export class AccountModule {}
