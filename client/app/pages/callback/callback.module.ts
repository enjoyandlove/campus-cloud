import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CallbackComponent } from './callback.component';
import { CallbackPasswordResetComponent } from './password-reset';

import { SharedModule } from '../../shared/shared.module';
import { CallbackRoutingModule } from './callback.routing.module';

@NgModule({
  declarations: [ CallbackComponent, CallbackPasswordResetComponent ],
  imports: [ CommonModule, ReactiveFormsModule, SharedModule, RouterModule, CallbackRoutingModule ],
  providers: [  ],
})
export class CallbackModule {}
