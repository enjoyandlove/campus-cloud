import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

import { AccountRoutingModule } from './account.routing.module';

import { ChangePasswordComponent } from './change-password';


@NgModule({
  declarations: [ChangePasswordComponent ],

  imports: [ CommonModule, RouterModule, ReactiveFormsModule, SharedModule,
  AccountRoutingModule ],

  providers: [  ],
})
export class AccountModule {}
