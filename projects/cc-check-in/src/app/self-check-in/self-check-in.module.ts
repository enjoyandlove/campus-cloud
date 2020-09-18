import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelfCheckInComponent } from './self-check-in.component';
import { SelfCheckInRoutingModule } from './self-check-in-routing.module';
import { CallbackModule } from '@campus-cloud/containers/callback/callback.module';
import { StoreModule } from '@ngrx/store';
import { webFormErrorReducer, webFormReducer } from '@campus-cloud/containers/callback/web-form';
import { ApiService } from '@campus-cloud/base';
import { BaseSelfCheckInComponent } from './base-self-check-in/base-self-check-in.component';
import { LayoutsModule } from '@campus-cloud/layouts/layouts.module';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { SelfRegisterComponent } from './self-register/self-register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelfCheckInService } from '@projects/cc-check-in/src/app/self-check-in/services/self-check-in.service';
import { SelfCheckInCallbackService } from '@projects/cc-check-in/src/app/self-check-in/services/self-check-in-callback.service';
import { SelfCheckInFeedbackComponent } from './self-check-in-feedback';
import { SharedModule } from '@campus-cloud/shared/shared.module';

@NgModule({
  declarations: [
    SelfCheckInComponent,
    BaseSelfCheckInComponent,
    SelfRegisterComponent,
    SelfCheckInFeedbackComponent
  ],
  imports: [
    CommonModule,
    SelfCheckInRoutingModule,
    CallbackModule,
    StoreModule.forFeature('webForm', webFormReducer),
    StoreModule.forFeature('webFormError', webFormErrorReducer),
    LayoutsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    CPI18nPipe,
    SelfCheckInService,
    SelfCheckInCallbackService,
    { provide: ApiService, useClass: SelfCheckInCallbackService }
  ]
})
export class SelfCheckInModule {}
